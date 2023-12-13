import { extendType, inputObjectType, nonNull } from 'nexus';
import { StorageProvider, ObjectionStorageProvider } from './storageProvider.js';

export const StorageProviderInputType = inputObjectType({
    name: 'StorageProviderInputType',
    definition(t) {
        t.nonNull.string('endpointUrl');
        t.nonNull.string('region');
        t.nonNull.string('bucket');
        t.nonNull.string('accessKeyId');
        t.nonNull.string('secretAccessKey');
    },
});

export const CreateStorageProviderMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('createStorageProvider', {
            type: StorageProvider,
            args: { data: StorageProviderInputType },
            async resolve(root, args, ctx) {
                const results = ObjectionStorageProvider.transaction(async (trx) => {
                    const storageProvider = await ObjectionStorageProvider.query(trx)
                        .insertAndFetch({
                            endpointUrl: args.data.endpointUrl,
                            region: args.data.region,
                            bucket: args.data.bucket,
                            accessKeyId: args.data.accessKeyId,
                            secretAccessKey: args.data.secretAccessKey,
                        })
                        .first();

                    return storageProvider;
                });

                return results;
            },
        });
    },
});
