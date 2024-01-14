import { builder } from '../../builder.js';
import { StorageProviderObject, StorageProviderObjectClass } from './storageProviderObject.js';

export const StorageProviderObjectEdge = builder.objectRef<StorageProviderObjectEdgeClass>(
    'StorageProviderObjectEdge',
);

builder.objectType(StorageProviderObjectEdge, {
    fields: (t) => ({
        cursor: t.exposeString('cursor'),
        node: t.field({
            type: StorageProviderObject,
            async resolve(root, _args, _ctx) {
                return await root.node;
            },
        }),
    }),
});

export class StorageProviderObjectEdgeClass {
    cursor!: string;
    node!: StorageProviderObjectClass;
}
