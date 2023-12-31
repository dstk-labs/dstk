import { MLModelVersion, ObjectionMLModelVersion } from './modelVersion.js';
import { builder } from '../../builder.js';

builder.queryFields((t) => ({
    listMLModelVersions: t.field({
        type: [MLModelVersion],
        authScopes: {
            loggedIn: true,
        },
        args: {
            modelId: t.arg.string({ required: true }),
        },
        async resolve(root, args, ctx) {
            const mlModelVersions = await ObjectionMLModelVersion.query()
                .where('modelId', args.modelId)
                .orderBy('numericVersion', 'ASC');
            return mlModelVersions;
        },
    }),
}));
