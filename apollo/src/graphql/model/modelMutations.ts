import { extendType, inputObjectType, nonNull } from 'nexus';
import { MLModel, ObjectionMLModel } from './model.js';
import { raw } from 'objection';

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
