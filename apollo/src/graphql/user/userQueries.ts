import { builder } from '../../builder.js';
import { db } from '../../db/kysely.js';
import { ApiKey } from '../auth/auth.js';
import { User } from './user.js';

builder.queryFields((t) => ({
    listApiKeys: t.field({
        type: [ApiKey],
        authScopes: {
            loggedIn: true,
        },
        async resolve(_root, _args, ctx) {
            const apiKeys = await db
                .selectFrom('dstk_user.api_key')
                .selectAll()
                .where(({ eb, and }) =>
                    and([
                        eb('dstk_user.api_key.user_id', '=', ctx.user.user_id),
                        eb('dstk_user.api_key.is_archived', '=', false),
                    ]),
                )
                .execute();

            return apiKeys;
        },
    }),
    listUsers: t.field({
        type: [User],
        authScopes: {
            loggedIn: true,
        },
        async resolve(_root, _args, _ctx) {
            const users = await db
                .selectFrom('dstk_user.user')
                .selectAll()
                .orderBy('dstk_user.user.user_name')
                .execute();

            return users;
        },
    }),
}));
