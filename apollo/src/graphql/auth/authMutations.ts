import { User, ObjectionUser, ObjectionUserEmail,  } from '../user/user.js';
import { AccountError } from '../../utils/errors.js';
import { HashBrown } from '../../utils/encryption.js';
import { builder } from '../../builder.js';

export const AccountInputType = builder.inputType('AccountInput', {
    fields: (t) => ({
        userName: t.string({ required: true }),
        password: t.string({ required: true }),
        realName: t.string({ required: true }),
        email: t.string({ required: true }),
    }),
});

builder.mutationFields((t) => ({
    createAccount: t.field({
        type: User,
        args: {
            data: t.arg({ type: AccountInputType, required: true }),
        },
        async resolve(root, args, ctx) {
            const HashSlingingSlasher = new HashBrown();
            const results = ObjectionUser.transaction(async (trx) => {
                const hashedPass = await HashSlingingSlasher.hash(args.data.password);
                const userAccount = await ObjectionUser.query(trx)
                    .insertAndFetch({
                        userName: args.data.userName,
                        password: hashedPass,
                        realName: args.data.realName,
                    })
                    .first();
                await ObjectionUserEmail.query(trx)
                    .insert({
                        emailAddress: args.data.email,
                        userId: userAccount.$id(),
                        isPrimary: true,
                        isVerified: false
                    });
                return userAccount;
            });
            return results;
        },
    }),
}));