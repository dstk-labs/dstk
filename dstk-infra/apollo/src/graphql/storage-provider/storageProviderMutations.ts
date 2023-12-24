import { extendType, inputObjectType, nonNull, stringArg } from 'nexus';
import { StorageProvider, ObjectionStorageProvider } from './storageProvider.js';
import Security from '../../utils/encryption.js';
import { raw } from 'objection';

const EncryptoMatic = new Security();

export const StorageProviderInputType = builder.inputType('StorageProviderInput', {
    fields: (t) => ({
        endpointUrl: t.string(),
        region: t.string(),
        bucket: t.string(),
        accessKeyId: t.string(),
        secretAccessKey: t.string(),
    }),
});

export const CreateStorageProviderMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('createStorageProvider', {
            type: StorageProvider,
            args: { data: StorageProviderInputType },
            async resolve(root, args, ctx) {
                const results = ObjectionStorageProvider.transaction(async (trx) => {
                    const encryptedAccessKeyId = EncryptoMatic.encrypt(args.data.accessKeyId);
                    const encryptedSecretAccessKey = EncryptoMatic.encrypt(
                        args.data.secretAccessKey,
                    );

                    const storageProvider = await ObjectionStorageProvider.query(trx)
                        .insertAndFetch({
                            endpointUrl: args.data.endpointUrl,
                            region: args.data.region,
                            bucket: args.data.bucket,
                            accessKeyId: encryptedAccessKeyId,
                            secretAccessKey: encryptedSecretAccessKey,
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
                providerId: nonNull(stringArg()),
                data: StorageProviderInputType,
            },
            async resolve(root, args, ctx) {
                const results = ObjectionStorageProvider.transaction(async (trx) => {
                    const encryptedAccessKeyId = EncryptoMatic.encrypt(args.data.accessKeyId);
                    const encryptedSecretAccessKey = EncryptoMatic.encrypt(
                        args.data.secretAccessKey,
                    );

                    const storageProvider = await ObjectionStorageProvider.query(
                        trx,
                    ).patchAndFetchById(args.providerId, {
                        endpointUrl: args.data.endpointUrl,
                        region: args.data.region,
                        bucket: args.data.bucket,
                        accessKeyId: encryptedAccessKeyId,
                        secretAccessKey: encryptedSecretAccessKey,
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
                providerId: nonNull(stringArg()),
            },
            async resolve(root, args, ctx) {
                const results = ObjectionStorageProvider.transaction(async (trx) => {
                    const storageProvider = await ObjectionStorageProvider.query(
                        trx,
                    ).patchAndFetchById(args.providerId, {
                        isArchived: raw('NOT is_archived'),
                        secretAccessKey: EncryptoMatic.encrypt('<DELETED>'),
                        accessKeyId: EncryptoMatic.encrypt('<DELETED>'),
                        dateModified: raw('NOW()'),
                    });

                    return storageProvider;
                });

                return results;
            },
        });
    },
});
