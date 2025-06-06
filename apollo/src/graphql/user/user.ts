import type { Selectable } from 'kysely';
import { builder } from '../../builder.js';
import type { DstkUserUser } from '../../db/db.js';

export type KyselyUser = Selectable<DstkUserUser>;

export const User = builder.objectRef<KyselyUser>('User');

builder.objectType(User, {
    fields: (t) => ({
        userId: t.field({
            type: 'ID',
            resolve(root: KyselyUser, _args, _ctx) {
                return root.user_id;
            },
        }),
        realName: t.exposeString('real_name'),
        email: t.exposeString('email'),
        isEmailVerified: t.exposeBoolean('is_email_verified'),
        isMfaEnrolled: t.exposeBoolean('is_mfa_enrolled'),
        image: t.exposeString('image'),
        userName: t.exposeString('user_name'),
        dateCreated: t.field({
            type: 'String',
            resolve(root: KyselyUser, _args, _ctx) {
                return root.date_created.toISOString();
            },
        }),
        dateModified: t.field({
            type: 'String',
            resolve(root: KyselyUser, _args, _ctx) {
                return root.date_modified.toISOString();
            },
        }),
    }),
});
