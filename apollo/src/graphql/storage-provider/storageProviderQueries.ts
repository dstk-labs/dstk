import { StorageProvider, ObjectionStorageProvider } from './storageProvider.js';
import { builder } from '../../builder.js';
import { ListObjects } from '../../utils/s3-api.js';
import { StorageProviderObjectConnection } from '../storage-provider/storageProviderObjectConnection.js';
import { ObjectionMLModelVersion } from '../model-version/modelVersion.js';
import { ObjectionTeamEdge } from '../user/team.js';
import { ObjectionMLModel } from '../model/model.js';
import { ObjectionProject } from '../user/project.js';

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
        async resolve(_root, args, ctx) {
            const modelVersion = (await ObjectionMLModelVersion.query()
                .findById(args.modelVersionId)
                .first()) as ObjectionMLModelVersion;

            const parentModel = (await ObjectionMLModel.query()
                .where('modelId', modelVersion.modelId)
                .first()) as ObjectionMLModel;

            const project = (await ObjectionProject.query().findById(
                parentModel.projectId,
            )) as ObjectionProject;
            await ObjectionTeamEdge.userHasRole(ctx.user.$id(), project.teamId, [
                'owner',
                'member',
            ]);

            const modelStorageProvider = (await ObjectionMLModelVersion.relatedQuery(
                'storageProvider',
            )
                .for(args.modelVersionId)
                .first()) as ObjectionStorageProvider;

            // Appends new folder name to base prefix
            const prefix = `${modelVersion.s3Prefix}`.concat(args.prefix ? '/' + args.prefix : '');

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
