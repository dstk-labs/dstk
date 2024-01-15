import { builder } from '../../builder.js';

export const StorageProviderObject =
    builder.objectRef<StorageProviderObjectClass>('StorageProviderObject');

builder.objectType(StorageProviderObject, {
    fields: (t) => ({
        name: t.field({
            type: 'String',
            nullable: true,
            resolve(root, _args, _ctx) {
                return root.name;
            },
        }),
        size: t.field({
            type: 'Int',
            nullable: true,
            resolve(root, _args, _ctx) {
                return root.size;
            },
        }),
        lastModified: t.field({
            type: 'String',
            nullable: true,
            resolve(root, _args, _ctx) {
                return root.lastModified;
            },
        }),
    }),
});

export class StorageProviderObjectClass {
    name?: string;
    size?: number;
    lastModified?: string;
}
