import { MLModel, ObjectionMLModel } from './model.js';
import { builder } from '../../builder.js';

builder.queryFields((t) => ({
    listMLModels: t.field({
        type: [MLModel],
        args: {
            modelName: t.arg.string(),
            limit: t.arg.int({ required: true }),
            offset: t.arg.int({ required: true }),
        },
        async resolve(_root, args, _ctx) {
            const query = ObjectionMLModel.query();
            if (args.modelName) {
                query.where('modelName', 'ILIKE', `%${args.modelName}%`);
            }
            const mlModel = await query
                .orderBy('dateCreated')
                .limit(args.limit)
                .offset(args.offset);
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
