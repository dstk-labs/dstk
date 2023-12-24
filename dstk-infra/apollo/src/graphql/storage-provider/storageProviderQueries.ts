import { StorageProvider, ObjectionStorageProvider } from './storageProvider.js';
import { builder } from '../../builder.js';

builder.queryFields((t) => ({
    listStorageProviders: t.field({
        type: [StorageProvider],
        async resolve(root, args, ctx) {
            const storageProvider = await ObjectionStorageProvider.query().orderBy('dateCreated');
            return storageProvider;
        },
    }),
    getStorageProvider: t.field({
        type: StorageProvider,
        nullable: true,
        args: {
            id: t.arg.string({ required: true }),
        },
        async resolve(root, args, ctx) {
            const storageProvider = (await ObjectionStorageProvider.query().findById(
                args.id,
            )) as typeof StorageProvider.$inferType;
            return storageProvider;
        },
    }),
}));
