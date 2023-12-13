import { extendType, stringArg, nonNull } from 'nexus';
import { MLModel, ObjectionMLModel } from './model.js';

export const ListMLModels = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('listModels', {
            type: MLModel,
            async resolve(root, args, ctx) {
                const query = ObjectionMLModel.query();
                const result = await query.orderBy('dateCreated');
                return result;
            },
        });
    },
});

export const GetMLModel = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('getModel', {
            type: MLModel,
            args: {
                modelId: nonNull(stringArg()),
            },
            async resolve(root, args, ctx) {
                return await ObjectionMLModel.query().findById(args.modelId);
            },
        });
    },
});
