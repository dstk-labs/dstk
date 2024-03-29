import { MLModel, ObjectionMLModel } from './model.js';
import { raw } from 'objection';
import { RegistryOperationError } from '../../utils/errors.js';
import { ObjectionStorageProvider } from '../storage-provider/storageProvider.js';
import { builder } from '../../builder.js';
import { ObjectionTeam, ObjectionTeamEdge } from '../user/team.js';
import { ObjectionProject } from '../user/project.js';

export const ModelInputType = builder.inputType('ModelInput', {
    fields: (t) => ({
        storageProviderId: t.string({ required: true }),
        projectId: t.string({ required: true }),
        modelName: t.string({ required: true }),
        description: t.string({ required: true }),
    }),
});

builder.mutationFields((t) => ({
    createModel: t.field({
        type: MLModel,
        authScopes: {
            loggedIn: true,
        },
        args: {
            data: t.arg({ type: ModelInputType, required: true }),
        },
        async resolve(root, args, ctx) {
            const results = ObjectionMLModel.transaction(async (trx) => {
                const project = await ObjectionProject.query()
                    .findById(args.data.projectId) as ObjectionProject;
                await ObjectionTeamEdge.userHasRole(
                    ctx.user.$id(),
                    project.teamId,
                    ['owner', 'member']
                );

                const storageProvider = await ObjectionTeam
                    .relatedQuery('storageProviders')
                    .for(project.teamId)
                    .where({ providerId: args.data.storageProviderId })
                    .first() as ObjectionStorageProvider | undefined;
                
                if (storageProvider === undefined) {
                    throw new RegistryOperationError({ name: 'PROVIDER_NOT_FOUND_ERROR' });
                }
                if (storageProvider.isArchived === true) {
                    throw new RegistryOperationError({ name: 'ARCHIVED_STORAGE_ERROR' });
                }

                const mlModel = await ObjectionMLModel.query(trx)
                    .insertAndFetch({
                        storageProviderId: args.data.storageProviderId,
                        projectId: project.$id(),
                        modelName: args.data.modelName,
                        description: args.data.description,
                        createdById: ctx.user.$id(),
                        modifiedById: ctx.user.$id(),
                    })
                    .first();

                return mlModel;
            });
            return results;
        },
    }),
    editModel: t.field({
        type: MLModel,
        authScopes: {
            loggedIn: true,
        },
        args: {
            modelId: t.arg.string({ required: true }),
            data: t.arg({ type: ModelInputType, required: true }),
        },
        async resolve(root, args, ctx) {
            const results = ObjectionMLModel.transaction(async (trx) => {
                const team = (await ObjectionMLModel
                    .relatedQuery('getTeam')
                    .for(args.modelId).first() as ObjectionTeam
                );
                await ObjectionTeamEdge.userHasRole(
                    ctx.user.$id(),
                    team.$id(),
                    ['owner', 'member']
                );

                const storageProvider = await team
                    .$relatedQuery('storageProviders')
                    .for(team.$id())
                    .where({ providerId: args.data.storageProviderId })
                    .first() as ObjectionStorageProvider | undefined;

                if (storageProvider === undefined) {
                    throw new RegistryOperationError({ name: 'PROVIDER_NOT_FOUND_ERROR' });
                }    
                if (storageProvider.isArchived === true) {
                    throw new RegistryOperationError({ name: 'ARCHIVED_STORAGE_ERROR' });
                }

                const mlModel = await ObjectionMLModel.query(trx).patchAndFetchById(args.modelId, {
                    modelName: args.data.modelName,
                    description: args.data.description,
                    dateModified: raw('NOW()'),
                    modifiedById: ctx.user.$id(),
                });
                if (mlModel.isArchived === true) {
                    throw new RegistryOperationError({ name: 'ARCHIVED_MODEL_ERROR' });
                }

                return mlModel;
            });

            return results;
        },
    }),
    archiveModel: t.field({
        type: MLModel,
        authScopes: {
            loggedIn: true,
        },
        args: {
            modelId: t.arg.string({ required: true }),
        },
        async resolve(root, args, ctx) {
            const results = ObjectionMLModel.transaction(async (trx) => {
                const team = (await ObjectionMLModel
                    .relatedQuery('getTeam')
                    .for(args.modelId).first() as ObjectionTeam
                );
                await ObjectionTeamEdge.userHasRole(
                    ctx.user.$id(),
                    team.$id(),
                    ['owner', 'member']
                );

                // Intentionally don't throw an error here on archived storage
                // providers. It's not unreasonable to want to mark old assets
                // as archived if their parent blob storage goes bye-bye
                const mlModel = await ObjectionMLModel.query(trx).patchAndFetchById(args.modelId, {
                    isArchived: raw('NOT is_archived'),
                    dateModified: raw('NOW()'),
                    modifiedById: ctx.user.$id(),
                });
                return mlModel;
            });

            return results;
        },
    }),
}));
