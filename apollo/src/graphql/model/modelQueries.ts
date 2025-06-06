import { MLModel } from './model.js';
import { builder } from '../../builder.js';
import { MLModelConnection } from './modelConnection.js';
import { CursorError } from '../../utils/errors.js';
import { Encoder } from '../../utils/encoder.js';
import { db } from '../../db/kysely.js';

const encoder = new Encoder();

builder.queryFields((t) => ({
    listMLModels: t.field({
        type: MLModelConnection,
        authScopes: {
            loggedIn: true,
        },
        args: {
            modelName: t.arg.string(),
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

                const userTeams = await trx
                    .selectFrom('dstk_user.team_edges')
                    .select('dstk_user.team_edges.team_id')
                    .where('dstk_user.team_edges.user_id', '=', ctx.user.user_id)
                    .execute();

                const userProjects = await trx
                    .selectFrom('dstk_user.projects')
                    .select('dstk_user.projects.project_id')
                    .where(
                        'dstk_user.projects.team_id',
                        'in',
                        userTeams.map((edge) => edge.team_id),
                    )
                    .execute();

                let query = trx
                    .selectFrom('registry.models')
                    .selectAll()
                    .where(
                        'registry.models.project_id',
                        'in',
                        userProjects.map((project) => project.project_id),
                    );

                if (args.modelName) {
                    query = query.where(
                        'registry.models.model_name',
                        'ilike',
                        `%${args.modelName}%`,
                    );
                }

                if (args.after) {
                    const cursor = await trx
                        .selectFrom('dstk_metadata.cursors')
                        .selectAll()
                        .where(({ eb, and }) =>
                            and([
                                // TODO: Why is args.after not typing correctly?
                                eb('dstk_metadata.cursors.cursor_token', '=', args.after!),
                                eb('dstk_metadata.cursors.cursor_relation', '=', 'model'),
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

                    const [id, dateCreated] = encoder.decode(cursor.cursor_token);

                    query = query.where(({ eb, and }) =>
                        and([
                            eb('registry.models.date_created', '>=', new Date(dateCreated)),
                            eb('registry.models.id', '>', Number.parseInt(id)),
                        ]),
                    );
                }

                const mlModels = await query
                    .limit(args.first + 1)
                    .orderBy(['registry.models.date_created', 'registry.models.id'])
                    .execute();

                const hasPreviousPage = !!args.after;
                const hasNextPage = mlModels.length > 1 && mlModels.length > args.first;
                const edges = mlModels.slice(0, args.first);

                const lastResult = edges[edges.length - 1];

                const cursor =
                    edges.length > 0
                        ? await trx
                              .selectFrom('dstk_metadata.cursors')
                              .select('dstk_metadata.cursors.cursor_id')
                              .where(
                                  'dstk_metadata.cursors.cursor_token',
                                  '=',
                                  encoder.encode(
                                      lastResult.id.toString(),
                                      lastResult.date_created.toISOString(),
                                  ),
                              )
                              .executeTakeFirst()
                        : undefined;

                const result = cursor
                    ? await trx
                          .updateTable('dstk_metadata.cursors')
                          .set({ expiration: nowPlusFiveMins })
                          .where('dstk_metadata.cursors.cursor_id', '=', cursor.cursor_id)
                          .returning('dstk_metadata.cursors.cursor_token')
                          .executeTakeFirst()
                    : edges.length > 0
                      ? await trx
                            .insertInto('dstk_metadata.cursors')
                            .values({
                                cursor_token: encoder.encode(
                                    edges[edges.length - 1].id,
                                    edges[edges.length - 1].date_created.toISOString(),
                                ),
                                cursor_relation: 'model',
                            })
                            .returning('dstk_metadata.cursors.cursor_token')
                            .executeTakeFirst()
                      : undefined;

                const continuationToken = result?.cursor_token;

                return {
                    edges: edges.map((mlModel) => ({
                        cursor: encoder.encode(
                            mlModel.id.toString(),
                            mlModel.date_created.toISOString(),
                        ),
                        node: mlModel,
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
    getMLModel: t.field({
        type: MLModel,
        authScopes: {
            loggedIn: true,
        },
        args: {
            modelId: t.arg.string({ required: true }),
        },
        async resolve(_root, args, ctx) {
            const userTeams = await db
                .selectFrom('dstk_user.team_edges')
                .select('dstk_user.team_edges.team_id')
                .where('dstk_user.team_edges.user_id', '=', ctx.user.user_id)
                .execute();

            const userProjects = await db
                .selectFrom('dstk_user.projects')
                .select('dstk_user.projects.project_id')
                .where(
                    'dstk_user.projects.team_id',
                    'in',
                    userTeams.map((edge) => edge.team_id),
                )
                .execute();

            const mlModel = await db
                .selectFrom('registry.models')
                .selectAll()
                .where(({ eb, and }) =>
                    and([
                        eb(
                            'registry.models.project_id',
                            'in',
                            userProjects.map((project) => project.project_id),
                        ),
                        eb('registry.models.model_id', '=', args.modelId),
                    ]),
                )
                .executeTakeFirst();

            return mlModel;
        },
    }),
}));
