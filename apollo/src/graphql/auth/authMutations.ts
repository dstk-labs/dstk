import { builder } from '../../builder.js';
import { auth } from '../../utils/auth.js';
import { User } from '../user/user.js';
import { db } from '../../db/kysely.js';
import { AccountError } from '../../utils/errors.js';
import { createTeam } from '../../utils/teamUtils.js';

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
        rememberMe: t.boolean({ defaultValue: true }),
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
        async resolve(_root, args, ctx) {
            const userName = await db
                .selectFrom('dstk_user.user')
                .select('dstk_user.user.user_name')
                .where(
                    ({ fn }) => fn('lower', ['dstk_user.user.user_name']),
                    '=',
                    args.data.userName,
                )
                .executeTakeFirst();
            if (userName) {
                throw new AccountError({ name: 'USERNAME_IN_USE_ERROR' });
            }

            const { headers, response } = await auth.api.signUpEmail({
                returnHeaders: true,
                body: {
                    name: args.data.realName,
                    email: args.data.email,
                    password: args.data.password,
                    user_name: args.data.userName,
                },
            });

            const cookies = headers.get('set-cookie');
            if (cookies === null) {
                throw new AccountError({ name: 'ACCOUNT_REGISTRATION_ERROR' });
            }
            ctx.res.set('Set-Cookie', cookies);

            const user = await db
                .selectFrom('dstk_user.user')
                .selectAll()
                .where('dstk_user.user.id', '=', response.user.id)
                .executeTakeFirstOrThrow();
            
            await createTeam({
                description: 'Your private team. Automatically created by DSTK.',
                name: 'Personal Team',
                userId: user.user_id,
            });

            return user;
        },
    }),
    login: t.field({
        type: 'String',
        args: {
            data: t.arg({ type: LoginInputType, required: true }),
        },
        async resolve(_args, args, ctx) {
            let body = {
                email: args.data.email,
                password: args.data.password,
            };

            if (args.data.rememberMe) {
                body = Object.assign({}, body, { rememberMe: args.data.rememberMe });
            }

            const { headers, response } = await auth.api.signInEmail({
                returnHeaders: true,
                body,
            });

            const cookies = headers.get('set-cookie');
            if (cookies === null) {
                throw new AccountError({ name: 'LOGIN_ERROR' });
            }
            ctx.res.set('Set-Cookie', cookies);

            return response.token;
        },
    }),
    logout: t.field({
        type: 'Boolean',
        async resolve(_root, _args, ctx) {
            const { success } = await auth.api.signOut({
                headers: ctx.headers,
            });

            return success;
        },
    }),
}));
