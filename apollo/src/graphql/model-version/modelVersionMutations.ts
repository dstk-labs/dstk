import { extendType, inputObjectType, nonNull, stringArg } from 'nexus';
import { MLModelVersion, ObjectionMLModelVersion } from './modelVersion.js';
import { raw } from 'objection';
import { ObjectionStorageProvider } from '../storage-provider/storageProvider.js';

export const ModelVersionInputType = inputObjectType({
    name: 'ModelVersionInput',
    definition(t) {
        t.nonNull.string('modelId');
        t.string('description');
    },
});

export const CreateModelVersionMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('createModelVersion', {
            type: MLModelVersion,
            args: { data: ModelVersionInputType },
            async resolve(root, args, ctx) {
                const results = ObjectionMLModelVersion.transaction(async (trx) => {
                    const modelStorageProvider = await ObjectionStorageProvider.query()
                        .select(
                            'registry.storageProviders.endpointUrl',
                            'registry.storageProviders.region',
                            'registry.storageProviders.bucket',
                            'registry.storageProviders.accessKeyId',
                            'registry.storageProviders.secretAccessKey',
                        )
                        .innerJoin(
                            'registry.models as m',
                            'registry.storageProviders.providerId',
                            'm.storageProviderId',
                        )
                        .where('m.modelId', args.data.modelId)
                        .first();

                    console.log(modelStorageProvider);

                    const lastModelVersion = await ObjectionMLModelVersion.query()
                        .select('numericVersion')
                        .where('modelId', args.data.modelId)
                        .orderBy('numericVersion', 'DESC')
                        .first();

                    const mlModelVersion = await ObjectionMLModelVersion.query(trx)
                        .insertAndFetch({
                            modelId: args.data.modelId,
                            description: args.data.description,
                            numericVersion: (lastModelVersion?.numericVersion || 0) + 1,
                        })
                        .first();

                    return mlModelVersion;
                });

                return results;
            },
        });
    },
});
