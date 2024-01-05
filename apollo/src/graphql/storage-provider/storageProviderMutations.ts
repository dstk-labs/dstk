import { StorageProvider, ObjectionStorageProvider } from './storageProvider.js';
import { Security } from '../../utils/encryption.js';
import { raw } from 'objection';
import { builder } from '../../builder.js';

const EncryptoMatic = new Security();

export const StorageProviderInputType = builder.inputType('StorageProviderInput', {
    fields: (t) => ({
        endpointUrl: t.string({ required: true }),
        region: t.string({ required: true }),
        bucket: t.string({ required: true }),
        accessKeyId: t.string({ required: true }),
        secretAccessKey: t.string({ required: true }),
    }),
});

builder.mutationFields((t) => ({
    createStorageProvider: t.field({
        type: StorageProvider,
        authScopes: {
            loggedIn: true,
        },
        args: {
            data: t.arg({ type: StorageProviderInputType, required: true }),
        },
        async resolve(root, args, ctx) {
            const results = ObjectionStorageProvider.transaction(async (trx) => {
                const encryptedAccessKeyId = EncryptoMatic.encrypt(args.data.accessKeyId);
                const encryptedSecretAccessKey = EncryptoMatic.encrypt(args.data.secretAccessKey);

                const storageProvider = await ObjectionStorageProvider.query(trx)
                    .insertAndFetch({
                        endpointUrl: args.data.endpointUrl,
                        region: args.data.region,
                        bucket: args.data.bucket,
                        accessKeyId: encryptedAccessKeyId,
                        secretAccessKey: encryptedSecretAccessKey,
                        createdById: ctx.user.$id(),
                        modifiedById: ctx.user.$id(),
                        ownerId: ctx.user.$id(),
                    })
                    .first();
                return storageProvider as typeof StorageProvider.$inferType;
            });

            return results;
        },
    }),
    editStorageProvider: t.field({
        type: StorageProvider,
        authScopes: {
            loggedIn: true,
        },
        args: {
            providerId: t.arg.string({ required: true }),
            data: t.arg({ type: StorageProviderInputType, required: true }),
        },
        async resolve(root, args, ctx) {
            const results = ObjectionStorageProvider.transaction(async (trx) => {
                const encryptedAccessKeyId = EncryptoMatic.encrypt(args.data.accessKeyId);
                const encryptedSecretAccessKey = EncryptoMatic.encrypt(args.data.secretAccessKey);

                const storageProvider = await ObjectionStorageProvider.query(trx).patchAndFetchById(
                    args.providerId,
                    {
                        endpointUrl: args.data.endpointUrl,
                        region: args.data.region,
                        bucket: args.data.bucket,
                        accessKeyId: encryptedAccessKeyId,
                        secretAccessKey: encryptedSecretAccessKey,
                        dateModified: raw('NOW()'),
                        modifiedById: ctx.user.$id(),
                    },
                );
                return storageProvider as typeof StorageProvider.$inferType;
            });

            return results;
        },
    }),
    archiveStorageProvider: t.field({
        type: StorageProvider,
        authScopes: {
            loggedIn: true,
        },
        args: {
            providerId: t.arg.string({ required: true }),
        },
        async resolve(root, args, ctx) {
            const results = ObjectionStorageProvider.transaction(async (trx) => {
                const storageProvider = await ObjectionStorageProvider.query(trx).patchAndFetchById(
                    args.providerId,
                    {
                        isArchived: raw('NOT is_archived'),
                        secretAccessKey: EncryptoMatic.encrypt('<DELETED>'),
                        accessKeyId: EncryptoMatic.encrypt('<DELETED>'),
                        dateModified: raw('NOW()'),
                        modifiedById: ctx.user.$id(),
                    },
                );

                return storageProvider as typeof StorageProvider.$inferType;
            });

            return results;
        },
    }),
}));
