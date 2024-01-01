import { MLModel, ObjectionMLModel } from './model.js';
import { builder } from '../../builder.js';
import { resolveCursorConnection, type ResolveCursorConnectionArgs } from '@pothos/plugin-relay';

builder.queryFields((t) => ({
    listMLModels: t.connection({
        type: MLModel,
        resolve: (_, args) =>
            resolveCursorConnection(
                {
                    args,
                    toCursor: (mlModel) => mlModel.id,
                },
                // Manually defining the arg type here is required
                // so that typescript can correctly infer the return value
                async ({ before, after, limit }: ResolveCursorConnectionArgs) => {
                    const query = ObjectionMLModel.query();

                    if (before) {
                        query.where('id', '<', parseInt(before));
                    }

                    if (after) {
                        query.where('id', '>', parseInt(after));
                    }

                    const mlModel = await query.limit(limit).orderBy('id');
                    return mlModel;
                },
            ),
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
