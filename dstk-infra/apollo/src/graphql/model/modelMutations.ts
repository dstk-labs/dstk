import { extendType, inputObjectType, nonNull, stringArg } from 'nexus';
import { MLModel, ObjectionMLModel } from './model.js';
import { raw } from 'objection';
import { RegistryOperationError } from '../../utils/errors.js';
import { ObjectionStorageProvider } from '../storage-provider/storageProvider.js';

export const ModelInputType = inputObjectType({
    name: 'ModelInput',
    definition(t) {
        t.nonNull.string('storageProviderId');
        t.nonNull.string('modelName');
        t.nonNull.string('description');
    },
});

export const CreateModelMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('createModel', {
            type: MLModel,
            args: { data: ModelInputType },
            async resolve(root, args, ctx) {
                const results = ObjectionMLModel.transaction(async (trx) => {
                    // TODO: some server-side validation that the supplied
                    // storage provider ID is a valid record (that the user
                    // has permission to utilize) is probably needed
                    const mlModel = await ObjectionMLModel.query(trx)
                        .insertAndFetch({
                            storageProviderId: args.data.storageProviderId,
                            modelName: args.data.modelName,
                            description: args.data.description,
                        })
                        .first();

                    return mlModel;
                });

                return results;
            },
        });
    },
});

export const EditModelMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('editModel', {
            type: MLModel,
            args: {
                modelId: nonNull(stringArg()),
                data: ModelInputType,
            },
            async resolve(root, args, ctx) {
                const results = ObjectionMLModel.transaction(async (trx) => {
                    const storageProvider = (await ObjectionMLModel.relatedQuery('storageProvider')
                        .for(args.modelId)
                        .first()) as ObjectionStorageProvider;
                    if (storageProvider.isArchived === true) {
                        throw new RegistryOperationError({ name: 'ARCHIVED_STORAGE_ERROR' });
                    }

                    const mlModel = await ObjectionMLModel.query(trx).patchAndFetchById(
                        args.modelId,
                        {
                            modelName: args.data.modelName,
                            description: args.data.description,
                            dateModified: raw('NOW()'),
                        },
                    );
                    if (mlModel.isArchived === true) {
                        throw new RegistryOperationError({ name: 'ARCHIVED_MODEL_ERROR' });
                    }

                    return mlModel;
                });

                return results;
            },
        });
    },
});

export const ArchiveModelMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('archiveModel', {
            type: MLModel,
            args: {
                modelId: nonNull(stringArg()),
            },
            async resolve(root, args, ctx) {
                const results = ObjectionMLModel.transaction(async (trx) => {
                    // Intentionally don't throw an error here on archived storage
                    // providers. It's not unreasonable to want to mark old assets
                    // as archived if their parent blob storage goes bye-bye
                    const mlModel = await ObjectionMLModel.query(trx).patchAndFetchById(
                        args.modelId,
                        {
                            isArchived: raw('NOT is_archived'),
                            dateModified: raw('NOW()'),
                        },
                    );
                    return mlModel;
                });

                return results;
            },
        });
    },
});
