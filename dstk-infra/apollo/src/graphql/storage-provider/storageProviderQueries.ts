import { extendType, stringArg, nonNull } from 'nexus';
import { StorageProvider, ObjectionStorageProvider } from './storageProvider.js';

export const ListStorageProviders = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('listStorageProviders', {
            type: StorageProvider,
            async resolve(root, args, ctx) {
                const storageProvider = await ObjectionStorageProvider.query().orderBy(
                    'dateCreated',
                );

                return storageProvider;
            },
        });
    },
});

export const GetStorageProvider = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('getStorageProvider', {
            type: StorageProvider,
            args: {
                id: nonNull(stringArg()),
            },
            async resolve(root, args, ctx) {
                const storageProvider = await ObjectionStorageProvider.query().findById(args.id);
                return storageProvider;
            },
        });
    },
});
