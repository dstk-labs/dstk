import { builder } from '../../builder.js';
import { PageInfo, PageInfoClass } from '../misc/pageInfo.js';
import { MLModelVersionEdge, MLModelVersionEdgeClass } from './modelVersionEdge.js';

export const MLModelVersionConnection = builder.objectRef<MLModelVersionConnectionClass>(
    'MLModelVersionConnection',
);

builder.objectType(MLModelVersionConnection, {
    fields: (t) => ({
        edges: t.field({
            type: [MLModelVersionEdge],
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

export class MLModelVersionConnectionClass {
    edges!: MLModelVersionEdgeClass[];
    pageInfo!: PageInfoClass;
}
