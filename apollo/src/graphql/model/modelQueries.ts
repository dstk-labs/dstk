import { MLModel, ObjectionMLModel } from './model.js';
import { builder } from '../../builder.js';
import { MLModelConnection } from './modelConnection.js';

builder.queryFields((t) => ({
    listMLModels: t.field({
        type: MLModelConnection,
        authScopes: {
            loggedIn: true,
        },
        args: {
            modelName: t.arg.string(),
            first: t.arg({
                type: 'Limit',
                defaultValue: 10,
                required: true,
            }),
            after: t.arg.string(),
        },
        async resolve(_root, args, _ctx) {
            const query = ObjectionMLModel.query();

            if (args.modelName) {
                query.where('modelName', 'ILIKE', `%${args.modelName}%`);
            }

            if (args.after) {
                query.where('id', '>', args.after);
            }

            const mlModels = await query.limit(args.first + 1).orderBy('id');

            const hasPreviousPage = mlModels.length > 0 ? !!args.after : false;
            const hasNextPage = mlModels.length > 0 ? mlModels.length > args.first : false;

            const edges = mlModels.slice(0, args.first);

            const continuationToken = edges.length > 0 ? edges[edges.length - 1].id : undefined;

            return {
                edges: edges.map((mlModel) => ({
                    cursor: mlModel.id,
                    node: mlModel,
                })),
                pageInfo: {
                    hasPreviousPage: hasPreviousPage,
                    hasNextPage: hasNextPage,
                    continuationToken: continuationToken,
                },
            };
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
