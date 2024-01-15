import { builder } from '../../builder.js';
import { PageInfo, PageInfoClass } from '../misc/pageInfo.js';
import {
    StorageProviderObjectEdge,
    StorageProviderObjectEdgeClass,
} from './storageProviderObjectEdge.js';

export const StorageProviderObjectConnection =
    builder.objectRef<StorageProviderObjectConnectionClass>('StorageProviderObjectConnection');

builder.objectType(StorageProviderObjectConnection, {
    fields: (t) => ({
        edges: t.field({
            type: [StorageProviderObjectEdge],
            resolve(root, _args, _ctx) {
                return root.edges;
            },
        }),
        pageInfo: t.field({
            type: PageInfo,
            resolve(root, _args, _ctx) {
                return root.pageInfo;
            },
        }),
    }),
});

export class StorageProviderObjectConnectionClass {
    edges!: StorageProviderObjectEdgeClass[];
    pageInfo!: PageInfoClass;
}
