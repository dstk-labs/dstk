import { builder } from '../../builder.js';
import { auth } from '../../utils/auth.js';
import { DstkUser, User } from '../user/user.js';
import { db } from '../../db/kysely.js';

export const AccountInputType = builder.inputType('AccountInput', {
    fields: (t) => ({
        userName: t.string({ required: true }),
        password: t.string({ required: true }),
        realName: t.string({ required: true }),
        email: t.string({ required: true }),
    }),
});

export const LoginInputType = builder.inputType('LoginInput', {
    fields: (t) => ({
        email: t.string({ required: true }),
        password: t.string({ required: true }),
    }),
});

builder.mutationFields((t) => ({
    createAccount: t.field({
        type: User,
        authScopes: {
            anonymousRequest: true,
        },
        args: {
            data: t.arg({ type: AccountInputType, required: true }),
        },
        async resolve(root, args, _ctx) {
            const result = await auth.api.signUpEmail({
                body: {
                    name: args.data.realName,
                    email: args.data.email,
                    password: args.data.password,
                    user_name: args.data.userName,
                },
            });

            const userId = result.user.id;

            const user = await db
                .selectFrom('dstk_user.user')
                .where('dstk_user.user.id', '=', parseInt(userId))
                .executeTakeFirstOrThrow();

            return user as DstkUser;
        },
    }),
    login: t.field({
        type: 'String',
        args: {
            data: t.arg({ type: LoginInputType, required: true }),
        },
        async resolve(_args, args, _ctx) {
            const result = await auth.api.signInEmail({
                body: {
                    email: args.data.email,
                    password: args.data.password,
                },
            });

            return result.token;
        },
    }),
}));
