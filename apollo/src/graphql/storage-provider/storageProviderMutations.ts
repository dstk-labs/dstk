import { StorageProvider, ObjectionStorageProvider } from './storageProvider.js';
import { Security } from '../../utils/encryption.js';
import { raw } from 'objection';
import { builder } from '../../builder.js';
import { ObjectionTeamEdge } from '../user/team.js';
import { RegistryOperationError } from '../../utils/errors.js';

const EncryptoMatic = new Security();

export const StorageProviderInputType = builder.inputType('StorageProviderInput', {
    fields: (t) => ({
        endpointUrl: t.string({ required: true }),
        region: t.string({ required: true }),
        bucket: t.string({ required: true }),
        accessKeyId: t.string({ required: true }),
        secretAccessKey: t.string({ required: true }),
        teamId: t.string({ required: true }),
    }),
});

export const EditStorageProviderInputType = builder.inputType('EditStorageProviderInput', {
    fields: (t) => ({
        providerId: t.string({ required: true }),
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
                await ObjectionTeamEdge.userHasRole(
                    ctx.user.$id(),
                    args.data.teamId,
                    ['owner', 'member']
                );

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
                        teamId: args.data.teamId,
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
            data: t.arg({ type: EditStorageProviderInputType, required: true }),
        },
        async resolve(root, args, ctx) {
            const results = ObjectionStorageProvider.transaction(async (trx) => {
                const storageProvider = await ObjectionStorageProvider.query()
                    .findById(args.data.providerId)
                    .first();
                
                if (storageProvider === undefined) {
                    throw new RegistryOperationError({ name: 'PROVIDER_NOT_FOUND_ERROR' });
                }

                await ObjectionTeamEdge.userHasRole(
                    ctx.user.$id(),
                    storageProvider.teamId,
                    ['owner', 'member']
                );

                const encryptedAccessKeyId = EncryptoMatic.encrypt(args.data.accessKeyId);
                const encryptedSecretAccessKey = EncryptoMatic.encrypt(args.data.secretAccessKey);

                await storageProvider.$query(trx).patchAndFetch({
                        accessKeyId: encryptedAccessKeyId,
                        secretAccessKey: encryptedSecretAccessKey,
                        dateModified: raw('NOW()'),
                        modifiedById: ctx.user.$id(),
                });
                return storageProvider;
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
                const storageProvider = await ObjectionStorageProvider.query()
                    .findById(args.providerId)
                    .first();
                
                if (storageProvider === undefined) {
                    throw new RegistryOperationError({ name: 'PROVIDER_NOT_FOUND_ERROR' });
                }

                await ObjectionTeamEdge.userHasRole(
                    ctx.user.$id(),
                    storageProvider.teamId,
                    ['owner']
                );

                storageProvider.$query(trx).patchAndFetch({
                    isArchived: raw('NOT is_archived'),
                    secretAccessKey: EncryptoMatic.encrypt('<DELETED>'),
                    accessKeyId: EncryptoMatic.encrypt('<DELETED>'),
                    dateModified: raw('NOW()'),
                    modifiedById: ctx.user.$id(),
                });

                return storageProvider;
            });

            return results;
        },
    }),
}));
