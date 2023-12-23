import { extendType, stringArg, nonNull } from 'nexus';
import { MLModelVersion, ObjectionMLModelVersion } from './modelVersion.js';

export const ListModelVersions = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('listModelVersions', {
            type: MLModelVersion,
            args: { modelId: nonNull(stringArg()) },
            async resolve(root, args, ctx) {
                const result = await ObjectionMLModelVersion.query()
                    .where('modelId', args.modelId)
                    .orderBy('numericVersion', 'ASC');
                return result;
            },
        });
    },
});

export const ListAllModelVersions = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('listAllModelVersions', {
            type: MLModelVersion,
            async resolve(_root, _args, _ctx) {
                const result = await ObjectionMLModelVersion.query().where(
                    'numericVersion',
                    '=',
                    ObjectionMLModelVersion.query().max('numericVersion'),
                );
                return result;
            },
        });
    },
});
