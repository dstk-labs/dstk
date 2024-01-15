import { StorageProvider, ObjectionStorageProvider } from './storageProvider.js';
import { builder } from '../../builder.js';
import { ListObjects } from '../../utils/s3-api.js';
import { StorageProviderObjectConnection } from '../storage-provider/storageProviderObjectConnection.js';
import { ObjectionMLModelVersion } from '../model-version/modelVersion.js';

builder.queryFields((t) => ({
    listStorageProviders: t.field({
        type: [StorageProvider],
        authScopes: {
            loggedIn: true,
        },
        async resolve(root, args, ctx) {
            const storageProvider = await ObjectionStorageProvider.query().orderBy('dateCreated');
            return storageProvider;
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
        async resolve(root, args, ctx) {
            const storageProvider = (await ObjectionStorageProvider.query().findById(
                args.storageProviderId,
            )) as typeof StorageProvider.$inferType;
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
        async resolve(_root, args, _ctx) {
            const modelStorageProvider = (await ObjectionMLModelVersion.relatedQuery(
                'storageProvider',
            )
                .for(args.modelVersionId)
                .first()) as ObjectionStorageProvider;

            const modelVersion = (await ObjectionMLModelVersion.query()
                .findById(args.modelVersionId)
                .first()) as ObjectionMLModelVersion;

            // Appends new folder name to base prefix
            const prefix = `${modelVersion.s3Prefix}`.concat(args.prefix ? '/' + args.prefix : '');

            /* If no continuation token, the s3 api will always
               return the root directory as an object. We do not want
               this returned to the client. */
            const limit = !args.after ? args.first + 1 : args.first;

            // To get Pothos and the S3 API to play nicely
            const maxKeys =
                args.after === null || args.after === undefined ? undefined : args.after;

            const { Contents, IsTruncated, NextContinuationToken, Prefix } = await ListObjects(
                modelStorageProvider,
                limit,
                prefix,
                maxKeys,
            );

            const objects = Contents
                ? Contents.map((Content) => ({
                      name: Content.Key,
                      size: Content.Size,
                      lastModified: Content.LastModified && Content.LastModified.toISOString(),
                  })).filter((Content) => Content.name?.slice(0, -1) !== Prefix)
                : [];

            return {
                edges:
                    objects.map((object) => ({
                        cursor: NextContinuationToken || '',
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
