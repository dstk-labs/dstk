import { extendType, inputObjectType, nonNull } from 'nexus';
import { StorageProvider, ObjectionStorageProvider } from './storageProvider.js';
import { raw } from 'objection';

export const StorageProviderInputType = inputObjectType({
    name: 'StorageProviderInput',
    definition(t) {
        t.nonNull.string('endpointUrl');
        t.nonNull.string('region');
        t.nonNull.string('bucket');
        t.nonNull.string('accessKeyId');
        t.nonNull.string('secretAccessKey');
    },
});

export const StorageProviderIdInputType = inputObjectType({
    name: 'StorageProviderId',
    definition(t) {
        t.nonNull.string('providerId');
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

export const EditStorageProviderMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('editStorageProvider', {
            type: StorageProvider,
            args: {
                providerId: StorageProviderIdInputType,
                data: StorageProviderInputType,
            },
            async resolve(root, args, ctx) {
                const results = ObjectionStorageProvider.transaction(async (trx) => {
                    const modifiedDate = Date.now().toString();
                    const storageProvider = await ObjectionStorageProvider.query(
                        trx,
                    ).patchAndFetchById(args.providerId.providerId, {
                        endpointUrl: args.data.endpointUrl,
                        region: args.data.region,
                        bucket: args.data.bucket,
                        accessKeyId: args.data.accessKeyId,
                        secretAccessKey: args.data.secretAccessKey,
                        dateModified: raw('NOW()'),
                    });

                    return storageProvider;
                });

                return results;
            },
        });
    },
});

export const ArchiveStorageProviderMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('archiveStorageProvider', {
            type: StorageProvider,
            args: {
                providerId: StorageProviderIdInputType,
            },
            async resolve(root, args, ctx) {
                const results = ObjectionStorageProvider.transaction(async (trx) => {
                    const storageProvider = await ObjectionStorageProvider.query(
                        trx,
                    ).patchAndFetchById(args.providerId.providerId, {
                        isArchived: raw('NOT is_archived'),
                        secretAccessKey: '<DELETED>',
                        accessKeyId: '<DELETED>',
                        dateModified: raw('NOW()'),
                    });
                    return storageProvider;
                });

                return results;
            },
        });
    },
});
