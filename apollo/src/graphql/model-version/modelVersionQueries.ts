import { MLModelVersion } from './modelVersion.js';
import { builder } from '../../builder.js';
import { MLModelVersionConnection } from './modelVersionConnection.js';
import { Encoder } from '../../utils/encoder.js';
import { CursorError, RegistryOperationError } from '../../utils/errors.js';
import { db } from '../../db/kysely.js';
import { userHasRole } from '../../utils/rls.js';

const encoder = new Encoder();

builder.queryFields((t) => ({
    listMLModelVersions: t.field({
        type: MLModelVersionConnection,
        authScopes: {
            loggedIn: true,
        },
        args: {
            modelId: t.arg.string({ required: true }),
            // TODO: Putting defaultValue & required overrides defaultValue
            first: t.arg({
                type: 'Limit',
                defaultValue: 10,
                required: true,
            }),
            after: t.arg.string(),
        },
        async resolve(_root, args, ctx) {
            const result = await db.transaction().execute(async (trx) => {
                const now = new Date(Date.now());
                const nowPlusFiveMins = new Date(Date.now() + 5 * 60 * 1000);

                let query = trx.selectFrom('registry.model_versions').selectAll();

                if (args.after) {
                    const cursor = await trx
                        .selectFrom('dstk_metadata.cursors')
                        .select([
                            'dstk_metadata.cursors.cursor_token',
                            'dstk_metadata.cursors.expiration',
                        ])
                        .where(({ eb, and }) =>
                            and([
                                // TODO: Not null assertion
                                eb('dstk_metadata.cursors.cursor_token', '=', args.after!),
                                eb('dstk_metadata.cursors.cursor_relation', '=', 'model_version'),
                            ]),
                        )
                        .executeTakeFirstOrThrow(
                            () => new CursorError({ name: 'TOKEN_DOES_NOT_EXIST' }),
                        );

                    if (cursor.expiration <= now) {
                        await trx
                            .updateTable('dstk_metadata.cursors')
                            .set({
                                expiration: nowPlusFiveMins,
                            })
                            .execute();
                    }

                    const [id, numericVersion] = encoder.encode(cursor.cursor_token);
                    query = query.where(({ eb, and }) =>
                        and([
                            eb(
                                'registry.model_versions.numeric_version',
                                '>',
                                Number.parseInt(numericVersion),
                            ),
                            eb('registry.model_versions.id', '>', Number.parseInt(id)),
                        ]),
                    );
                }

                const parentModel = await trx
                    .selectFrom('registry.models')
                    .select('registry.models.project_id')
                    .where('registry.models.model_id', '=', args.modelId)
                    .executeTakeFirstOrThrow(
                        () => new RegistryOperationError({ name: 'MODEL_PERMISSION_ERROR' }),
                    );

                const project = await trx
                    .selectFrom('dstk_user.projects')
                    .select('dstk_user.projects.team_id')
                    .where('dstk_user.projects.project_id', '=', parentModel.project_id)
                    .executeTakeFirstOrThrow(
                        () => new RegistryOperationError({ name: 'PROJECT_PERMISSION_ERROR' }),
                    );

                await userHasRole({
                    userId: ctx.user.user_id,
                    teamId: project.team_id,
                    roles: ['owner', 'member'],
                });

                const mlModelVersions = await query
                    .where('registry.model_versions.model_id', '=', args.modelId)
                    .limit(args.first + 1)
                    .orderBy([
                        'registry.model_versions.numeric_version',
                        'registry.model_versions.id',
                    ])
                    .execute();

                const hasPreviousPage = !!args.after;
                const hasNextPage =
                    mlModelVersions.length > 1 && mlModelVersions.length > args.first;
                const edges = mlModelVersions.slice(0, args.first);

                const lastResult = edges[edges.length - 1];

                const cursor =
                    edges.length > 0
                        ? await trx
                              .selectFrom('dstk_metadata.cursors')
                              .select('dstk_metadata.cursors.cursor_id')
                              .where(({ eb, and }) =>
                                  and([
                                      eb(
                                          'dstk_metadata.cursors.cursor_relation',
                                          '=',
                                          'model_version',
                                      ),
                                      eb(
                                          'dstk_metadata.cursors.cursor_token',
                                          '=',
                                          encoder.encode(lastResult.id, lastResult.numeric_version),
                                      ),
                                  ]),
                              )
                              .executeTakeFirst()
                        : undefined;

                const result = cursor
                    ? await trx
                          .updateTable('dstk_metadata.cursors')
                          .set({
                              expiration: nowPlusFiveMins,
                          })
                          .where('dstk_metadata.cursors.cursor_id', '=', cursor.cursor_id)
                          .returning('dstk_metadata.cursors.cursor_token')
                          .executeTakeFirst()
                    : edges.length > 0
                      ? await trx
                            .insertInto('dstk_metadata.cursors')
                            .values({
                                cursor_relation: 'model_version',
                                cursor_token: encoder.encode(
                                    edges[edges.length - 1].id,
                                    edges[edges.length - 1].numeric_version,
                                ),
                            })
                            .returning('dstk_metadata.cursors.cursor_token')
                            .executeTakeFirst()
                      : undefined;

                const continuationToken = result?.cursor_token;

                return {
                    edges: edges.map((mlModelVersion) => ({
                        cursor: encoder.encode(mlModelVersion.id, mlModelVersion.numeric_version),
                        node: mlModelVersion,
                    })),
                    pageInfo: {
                        hasPreviousPage: hasPreviousPage,
                        hasNextPage: hasNextPage,
                        continuationToken: continuationToken,
                    },
                };
            });

            return result;
        },
    }),
    getMLModelVersion: t.field({
        type: MLModelVersion,
        authScopes: {
            loggedIn: true,
        },
        args: {
            modelVersionId: t.arg.string({ required: true }),
        },
        async resolve(_root, args, ctx) {
            const mlModelVersion = await db
                .selectFrom('registry.model_versions')
                .selectAll()
                .where('registry.model_versions.model_version_id', '=', args.modelVersionId)
                .executeTakeFirstOrThrow(
                    () => new RegistryOperationError({ name: 'VERSION_PERMISSION_ERROR' }),
                );

            const parentModel = await db
                .selectFrom('registry.models')
                .select('registry.models.project_id')
                .where('registry.models.model_id', '=', mlModelVersion.model_id)
                .executeTakeFirstOrThrow(
                    () => new RegistryOperationError({ name: 'MODEL_PERMISSION_ERROR' }),
                );

            const project = await db
                .selectFrom('dstk_user.projects')
                .select('dstk_user.projects.team_id')
                .where('dstk_user.projects.project_id', '=', parentModel.project_id)
                .executeTakeFirstOrThrow(
                    () => new RegistryOperationError({ name: 'PROJECT_PERMISSION_ERROR' }),
                );

            await userHasRole({
                userId: ctx.user.user_id,
                teamId: project.team_id,
                roles: ['owner', 'member', 'viewer'],
            });

            return mlModelVersion;
        },
    }),
}));
