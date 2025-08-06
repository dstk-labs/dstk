import { MLModelVersion } from './modelVersion.js';
import { builder } from '../../builder.js';
import { MLModelVersionConnection } from './modelVersionConnection.js';
import { Encoder } from '../../utils/encoder.js';
import { RegistryOperationError } from '../../utils/errors.js';
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
            includeArchived: t.arg.boolean({ required: true, defaultValue: false }),
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
                let query = trx.selectFrom('registry.model_versions').selectAll();

                if (!args.includeArchived) {
                    query = query.where(
                        'registry.model_versions.is_archived', 'is', false
                    )
                }

                if (args.after) {
                    const [numericVersion] = encoder.decode(args.after);
                    query = query.where(
                        'registry.model_versions.numeric_version', '>', parseInt(numericVersion)
                    )
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
                        'registry.model_versions.id',
                        'registry.model_versions.numeric_version',
                    ])
                    .execute();

                const hasPreviousPage = !!args.after;
                const hasNextPage =
                    mlModelVersions.length > 1 && mlModelVersions.length > args.first;

                const lastResult = mlModelVersions[mlModelVersions.length - 2];
                const continuationToken = hasNextPage ? encoder.encode(lastResult.numeric_version) : undefined;

                return {
                    edges: mlModelVersions.slice(0, args.first).map((mlModelVersion) => ({
                        cursor: continuationToken,
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
