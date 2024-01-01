import { builder } from '../../builder.js';
import { ApiKey, ObjectionApiKey } from '../auth/auth.js';
import { ObjectionUser } from '../user/user.js';
import {v4 as uuidv4} from 'uuid';

builder.mutationFields((t) => ({
    createApiKey: t.field({
        type: ApiKey,
        async resolve(root, args, ctx) {
            const results = ObjectionApiKey.transaction(async (trx) => {
                const user = (await ObjectionUser.query()
                    .findById(ctx.userAuth.userId)) as ObjectionUser;

                const apiKey = uuidv4().replace(/-/g, "");
                const userApiKey = await ObjectionApiKey.query(trx)
                    .insertAndFetch({
                        userId: user.id,
                        apiKey: apiKey,
                    })
                    .first();

                return userApiKey;
            });
            return results;
        },
    }),
    archiveApiKey: t.field({
        type: ApiKey,
        args: {
            apiKeyId: t.arg.string({ required: true }),
        },
        async resolve(root, args, ctx) {
            const results = ObjectionApiKey.transaction(async (trx) => {
                const user = (await ObjectionUser.query()
                    .findById(ctx.userAuth.userId)) as ObjectionUser;

                const userApiKey = await ObjectionApiKey.query(trx)
                    .patchAndFetchById(
                        args.apiKeyId,
                        { isArchived: true }
                    )
                    .where('userId', user.id)
                    .first();

                return userApiKey;
            });
            return results;
        },
    }),
}));