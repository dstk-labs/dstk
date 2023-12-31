import { MLModel, ObjectionMLModel } from './model.js';
import { builder } from '../../builder.js';

builder.queryFields((t) => ({
    listMLModels: t.field({
        type: [MLModel],
        args: {
            modelName: t.arg.string(),
            limit: t.arg({
                type: 'Limit',
                defaultValue: 10,
            }),
            offset: t.arg.int({
                defaultValue: 10,
            }),
        },
        async resolve(_root, args, _ctx) {
            const query = ObjectionMLModel.query();
            if (args.modelName) {
                query.where('modelName', 'ILIKE', `%${args.modelName}%`);
            }
            /* We provide default values for limit and offset but the type
               inference does not resolve correctly */
            if (args.limit && args.offset) {
                query.limit(args.limit).offset(args.offset);
            }
            const mlModel = await query.orderBy('dateCreated');
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
