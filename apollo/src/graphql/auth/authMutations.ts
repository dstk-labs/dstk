import { User, ObjectionUser, ObjectionUserEmail } from '../user/user.js';
import { AccountError } from '../../utils/errors.js';
import { HashBrown } from '../../utils/encryption.js';
import { JWTValidator, PartialSession } from '../../utils/jwt.js';
import { builder } from '../../builder.js';
import { raw } from 'objection';
import { convertSDL } from 'nexus';

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
        userName: t.string({ required: true }),
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
        async resolve(root, args, ctx) {
            const HashSlingingSlasher = new HashBrown();
            const results = ObjectionUser.transaction(async (trx) => {
                const username = await ObjectionUser.query()
                    .where(raw('LOWER(user_name)'), args.data.userName.toLowerCase())
                    .first();
                if (username) {
                    throw new AccountError({ name: 'USERNAME_IN_USE_ERROR' });
                }

                const hashedPass = await HashSlingingSlasher.hash(args.data.password);
                const userAccount = await ObjectionUser.query(trx)
                    .insertAndFetch({
                        userName: args.data.userName,
                        password: hashedPass,
                        realName: args.data.realName,
                    })
                    .first();
                await ObjectionUserEmail.query(trx).insert({
                    emailAddress: args.data.email,
                    userId: userAccount.$id(),
                    isPrimary: true,
                    isVerified: false,
                });

                return userAccount;
            });
            return results;
        },
    }),
    login: t.field({
        type: 'String',
        args: {
            data: t.arg({ type: LoginInputType, required: true }),
        },
        async resolve(root, args, ctx) {
            const HashSlingingSlasher = new HashBrown();
            const JWT = new JWTValidator();

            const results = ObjectionUser.transaction(async (trx) => {
                const userAccount = await ObjectionUser.query()
                    .where(raw('LOWER(user_name)'), args.data.userName.toLowerCase())
                    .first();
                if (!userAccount) {
                    throw new AccountError({ name: 'LOGIN_ERROR' });
                }

                const verified = await HashSlingingSlasher.verify(
                    userAccount.password,
                    args.data.password,
                );

                if (!verified) {
                    throw new AccountError({ name: 'LOGIN_ERROR' });
                }

                const partialSession = {
                    dateCreated: Date.now(),
                    userId: userAccount.$id(),
                };
                const token = JWT.encodeSession(partialSession);
                return token;
            });
            return results;
        },
    }),
}));
