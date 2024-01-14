import { builder } from '../../builder.js';

export const StorageProviderObjectType = builder.enumType('StorageProviderObjectType', {
    values: ['folder', 'file'] as const,
});

export const StorageProviderObject =
    builder.objectRef<StorageProviderObjectClass>('StorageProviderObject');

builder.objectType(StorageProviderObject, {
    fields: (t) => ({
        id: t.field({
            type: 'String',
            nullable: true,
            resolve(root, _args, _ctx) {
                return root.id;
            },
        }),
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
        type: t.field({
            type: StorageProviderObjectType,
            nullable: true,
            resolve(root, _args, _ctx) {
                return root.type;
            },
        }),
    }),
});

export class StorageProviderObjectClass {
    id?: string;
    name?: string;
    size?: number;
    lastModified?: string;
    type?: 'file' | 'folder';
}
