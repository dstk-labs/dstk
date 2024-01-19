import { builder } from '../../builder.js';
import { ApiKey, ObjectionApiKey } from '../auth/auth.js';
import { ObjectionTeamEdge } from './team.js';
import { ObjectionUser, User } from './user.js';

builder.queryFields((t) => ({
    listApiKeys: t.field({
        type: [ApiKey],
        authScopes: {
            loggedIn: true,
        },
        async resolve(_root, args, _ctx) {
            const apiKeys = await ObjectionApiKey.query().where({
                userId: _ctx.user.$id(),
                isArchived: false,
            });
            return apiKeys;
        },
    }),
    listUsers: t.field({
        type: [User],
        authScopes: {
            loggedIn: true,
        },
        args: {
            teamId: t.arg.string({ required: true }),
        },
        async resolve(_root, args, ctx) {
            await ObjectionTeamEdge.userHasRole(ctx.user.$id(), args.teamId, ['owner']);

            const users = await ObjectionUser.query()
                .where('isApproved', '=', true)
                .orderBy('userName');
            return users;
        },
    }),
}));
