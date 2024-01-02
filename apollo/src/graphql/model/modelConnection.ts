import { builder } from '../../builder.js';
import { PageInfo, PageInfoClass } from '../misc/pageInfo.js';
import { MLModelEdge, MLModelEdgeClass } from './modelEdge.js';

export const MLModelConnection = builder.objectRef<MLModelConnectionClass>('MLModelConnection');

builder.objectType(MLModelConnection, {
    fields: (t) => ({
        edges: t.field({
            type: [MLModelEdge],
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

export class MLModelConnectionClass {
    edges!: MLModelEdgeClass[];
    pageInfo!: PageInfoClass;
}
