import { builder } from '../../builder.js';
import { MLModelVersion, ObjectionMLModelVersion } from './modelVersion.js';

export const MLModelVersionEdge = builder.objectRef<MLModelVersionEdgeClass>('MLModelVersionEdge');

builder.objectType(MLModelVersionEdge, {
    fields: (t) => ({
        cursor: t.exposeString('cursor'),
        node: t.field({
            type: MLModelVersion,
            async resolve(root, _args, _ctx) {
                return await root.node;
            },
        }),
    }),
});

export class MLModelVersionEdgeClass {
    cursor!: string;
    node!: ObjectionMLModelVersion;
}
