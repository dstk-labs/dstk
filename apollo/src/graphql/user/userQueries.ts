import { builder } from '../../builder.js';
import { ApiKey, ObjectionApiKey } from '../auth/auth.js';

builder.queryFields((t) => ({
    listApiKeys: t.field({
        type: [ApiKey],
        async resolve(_root, args, _ctx) {
            const apiKeys = await ObjectionApiKey.query()
                .where({
                    userId: _ctx.userAuth.userId,
                    isArchived: false,
                });
            return apiKeys;
        },
    }),
}));
