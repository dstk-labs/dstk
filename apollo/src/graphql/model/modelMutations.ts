import { MLModel, ObjectionMLModel } from './model.js';
import { ObjectionUser } from '../user/user.js';
import { ObjectionStorageProvider } from '../storage-provider/storageProvider.js';
import { RegistryOperationError } from '../../utils/errors.js';
import { raw } from 'objection';
import { builder } from '../../builder.js';

export const ModelInputType = builder.inputType('ModelInput', {
    fields: (t) => ({
        storageProviderId: t.string({ required: true }),
        modelName: t.string({ required: true }),
        description: t.string({ required: true }),
    }),
});

builder.mutationFields((t) => ({
    createModel: t.field({
        type: MLModel,
        args: {
            data: t.arg({ type: ModelInputType, required: true }),
        },
        async resolve(root, args, ctx) {
            const results = ObjectionMLModel.transaction(async (trx) => {
                const user = (await ObjectionUser.query()
                    .findById(ctx.userAuth.userId)) as ObjectionUser;

                const storageProvider = (await ObjectionStorageProvider.query().findById(
                    args.data.storageProviderId,
                )) as ObjectionStorageProvider;
                if (storageProvider.isArchived === true) {
                    throw new RegistryOperationError({ name: 'ARCHIVED_STORAGE_ERROR' });
                }

                // TODO: some server-side validation that the supplied
                // storage provider ID is a valid record (that the user
                // has permission to utilize) is probably needed
                const mlModel = await ObjectionMLModel.query(trx)
                    .insertAndFetch({
                        storageProviderId: storageProvider.id,
                        modelName: args.data.modelName,
                        description: args.data.description,
                        createdById: user.id,
                        modifiedById: user.id,
                    })
                    .first();

                return mlModel as typeof MLModel.$inferType;
            });
            return results;
        },
    }),
    editModel: t.field({
        type: MLModel,
        args: {
            modelId: t.arg.string({ required: true }),
            data: t.arg({ type: ModelInputType, required: true }),
        },
        async resolve(root, args, ctx) {
            const results = ObjectionMLModel.transaction(async (trx) => {
                const user = (await ObjectionUser.query()
                    .findById(ctx.userAuth.userId)) as ObjectionUser;

                const storageProvider = (await ObjectionMLModel.relatedQuery('storageProvider')
                    .for(args.modelId)
                    .first()) as ObjectionStorageProvider;
                if (storageProvider.isArchived === true) {
                    throw new RegistryOperationError({ name: 'ARCHIVED_STORAGE_ERROR' });
                }

                const mlModel = await ObjectionMLModel.query(trx).patchAndFetchById(args.modelId, {
                    modelName: args.data.modelName,
                    description: args.data.description,
                    dateModified: raw('NOW()'),
                    modifiedById: user.id,
                });
                if (mlModel.isArchived === true) {
                    throw new RegistryOperationError({ name: 'ARCHIVED_MODEL_ERROR' });
                }

                return mlModel as typeof MLModel.$inferType;
            });

            return results;
        },
    }),
    archiveModel: t.field({
        type: MLModel,
        args: {
            modelId: t.arg.string({ required: true }),
        },
        async resolve(root, args, ctx) {
            const results = ObjectionMLModel.transaction(async (trx) => {
                const user = (await ObjectionUser.query()
                    .findById(ctx.userAuth.userId)) as ObjectionUser;

                // Intentionally don't throw an error here on archived storage
                // providers. It's not unreasonable to want to mark old assets
                // as archived if their parent blob storage goes bye-bye
                const mlModel = await ObjectionMLModel.query(trx).patchAndFetchById(args.modelId, {
                    isArchived: raw('NOT is_archived'),
                    dateModified: raw('NOW()'),
                    modifiedById: user.id,
                });
                return mlModel as typeof MLModel.$inferType;
            });

            return results;
        },
    }),
}));
