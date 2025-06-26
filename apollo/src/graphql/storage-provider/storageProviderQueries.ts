import { StorageProvider } from './storageProvider.js';
import { builder } from '../../builder.js';
import { ListObjects } from '../../utils/s3-api.js';
import { StorageProviderObjectConnection } from '../storage-provider/storageProviderObjectConnection.js';
import { RegistryOperationError } from '../../utils/errors.js';
import { db } from '../../db/kysely.js';
import { userHasRole } from '../../utils/rls.js';
import type { Expression, SqlBool } from 'kysely';

builder.queryFields((t) => ({
    listStorageProviders: t.field({
        type: [StorageProvider],
        authScopes: {
            loggedIn: true,
        },
        args: {
            includeArchived: t.arg.boolean({ required: true, defaultValue: false }),
            bucket: t.arg.string(),
            teamId: t.arg.string({ required: true }),
        },
        async resolve(_root, args, ctx) {
            await userHasRole({
                userId: ctx.user.user_id,
                teamId: args.teamId,
                roles: ['owner', 'member', 'viewer'],
            });

            const storageProviders = await db
                .selectFrom('registry.storage_providers')
                .selectAll()
                .where((eb) => {
                    const statements: Expression<SqlBool>[] = [];

                    statements.push(eb(
                        'registry.storage_providers.team_id', '=', args.teamId,
                    ));

                    if (!args.includeArchived) {
                        statements.push(eb(
                            'registry.storage_providers.is_archived', 'is', false
                        ));
                    }

                    if (args.bucket) {
                        statements.push(eb(
                            'registry.storage_providers.bucket', 'ilike', `%${args.bucket}%`,
                        ))
                    }

                    return eb.and(statements)
                })
                .orderBy('registry.storage_providers.date_created')
                .execute();

            return storageProviders;
        },
    }),
    getStorageProvider: t.field({
        type: StorageProvider,
        authScopes: {
            loggedIn: true,
        },
        args: {
            storageProviderId: t.arg.string({ required: true }),
        },
        async resolve(_root, args, ctx) {
            const storageProvider = await db
                .selectFrom('registry.storage_providers')
                .selectAll()
                .where('registry.storage_providers.provider_id', '=', args.storageProviderId)
                .executeTakeFirstOrThrow(
                    () => new RegistryOperationError({ name: 'PROVIDER_NOT_FOUND_ERROR' }),
                );

            await userHasRole({
                userId: ctx.user.user_id,
                teamId: storageProvider.team_id,
                roles: ['owner', 'member', 'viewer'],
            });

            return storageProvider;
        },
    }),
    listObjectsForModelVersion: t.field({
        type: StorageProviderObjectConnection,
        authScopes: {
            loggedIn: true,
        },
        args: {
            modelVersionId: t.arg.string({ required: true }),
            // TODO: Putting defaultValue & required overrides defaultValue
            first: t.arg({
                type: 'Limit',
                defaultValue: 10,
                required: true,
            }),
            after: t.arg.string(),
            prefix: t.arg.string(),
        },
        async resolve(_root, args, ctx) {
            const modelVersion = await db
                .selectFrom('registry.model_versions')
                .select(['registry.model_versions.model_id', 'registry.model_versions.s3_prefix'])
                .where('registry.model_versions.model_version_id', '=', args.modelVersionId)
                .executeTakeFirstOrThrow(
                    () => new RegistryOperationError({ name: 'VERSION_PERMISSION_ERROR' }),
                );

            const parentModel = await db
                .selectFrom('registry.models')
                .select(['registry.models.project_id', 'registry.models.storage_provider_id'])
                .where('registry.models.model_id', '=', modelVersion.model_id)
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

            const modelStorageProvider = await db
                .selectFrom('registry.storage_providers')
                .selectAll()
                .where(
                    'registry.storage_providers.provider_id',
                    '=',
                    parentModel.storage_provider_id,
                )
                .executeTakeFirstOrThrow(
                    () => new RegistryOperationError({ name: 'PROVIDER_NOT_FOUND_ERROR' }),
                );

            const prefix = `${modelVersion.s3_prefix}`.concat(args.prefix ? '/' + args.prefix : '');

            /* If no continuation token, the s3 api will always
               return the root directory as an object. We do not want
               this returned to the client. */
            const limit = !args.after ? args.first + 1 : args.first;

            // To get Pothos and the S3 API to play nicely
            const maxKeys = args?.after || undefined;

            const { Contents, IsTruncated, NextContinuationToken, Prefix } = await ListObjects(
                modelStorageProvider,
                limit,
                prefix,
                maxKeys,
            );

            const objects = Contents
                ? Contents.filter((Content) => Content.Key?.slice(0, -1) !== Prefix).map(
                      (Content) => ({
                          name: Content.Key && Content.Key.replace(prefix + '/', ''),
                          size: Content.Size,
                          lastModified: Content.LastModified && Content.LastModified.toISOString(),
                      }),
                  )
                : [];

            return {
                edges:
                    objects.map((object) => ({
                        cursor: NextContinuationToken ?? '',
                        node: object,
                    })) ?? [],
                pageInfo: {
                    hasPreviousPage: !!args.after,
                    hasNextPage: IsTruncated ?? false,
                    continuationToken: NextContinuationToken,
                },
            };
        },
    }),
}));
