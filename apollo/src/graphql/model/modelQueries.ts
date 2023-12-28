import { MLModel, ObjectionMLModel } from './model.js';
import { builder } from '../../builder.js';

builder.queryFields((t) => ({
    listMLModels: t.field({
        type: [MLModel],
        args: {
            modelName: t.arg.string(),
        },
        async resolve(_root, args, _ctx) {
            const mlModel = await ObjectionMLModel.query()
                .where('modelName', 'LIKE', `${args.modelName || ''}%`)
                .orderBy('dateCreated');
            return mlModel;
        },
    }),
    getMLModel: t.field({
        type: MLModel,
        args: {
            modelId: t.arg.string({ required: true }),
        },
        async resolve(root, args, ctx) {
            const mlModel = (await ObjectionMLModel.query().findById(
                args.modelId,
            )) as typeof MLModel.$inferType;
            return mlModel;
        },
    }),
}));
