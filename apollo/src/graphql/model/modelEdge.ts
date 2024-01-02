import { builder } from '../../builder.js';
import { MLModel, ObjectionMLModel } from './model.js';

export const MLModelEdge = builder.objectRef<MLModelEdgeClass>('MLModelEdge');

builder.objectType(MLModelEdge, {
    fields: (t) => ({
        cursor: t.exposeString('cursor'),
        node: t.field({
            type: MLModel,
            async resolve(root, _args, _ctx) {
                return await root.node;
            },
        }),
    }),
});

export class MLModelEdgeClass {
    cursor!: string;
    node!: ObjectionMLModel;
}
