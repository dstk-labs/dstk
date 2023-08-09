import { extendType, stringArg, nonNull } from 'nexus';
import { StorageProvider, ObjectionStorageProvider } from './storageProvider.js';

export const ListStorageProviders = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('listStorageProviders', {
            type: StorageProvider,
            async resolve(root, args, ctx) {
                let query = ObjectionStorageProvider.query();
                const result = await query.orderBy('dateCreated');
                return result;
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
                // TODO: need to mask access key ID and
                // secret access key
                return await ObjectionStorageProvider.query().findById(args.id);
            },
        });
    },
});