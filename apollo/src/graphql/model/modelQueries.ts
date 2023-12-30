import { MLModel, ObjectionMLModel } from './model.js';
import { builder } from '../../builder.js';

builder.queryFields((t) => ({
    listMLModels: t.field({
        type: [MLModel],
        args: {
            modelName: t.arg.string(),
            limit: t.arg.int(),
            offset: t.arg.int(),
        },
        async resolve(_root, args, _ctx) {
            const query = ObjectionMLModel.query();
            if (args.modelName) {
                query.where('modelName', 'ILIKE', `%${args.modelName}%`);
            }
            const mlModel = await query
                .limit(args.limit || 10)
                .offset(args.offset || 0)
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
