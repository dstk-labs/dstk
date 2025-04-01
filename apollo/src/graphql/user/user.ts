import { Insertable, Updateable, type Selectable } from 'kysely';
import { builder } from '../../builder.js';
import { DstkUserUser } from '../../db/db.js';

export type DstkUser = Selectable<DstkUserUser>;
export type InsertDstkUser = Insertable<DstkUserUser>;
export type UpdateDstkUser = Updateable<DstkUserUser>;

export const User = builder.objectRef<DstkUser>('User');

builder.objectType(User, {
    fields: (t) => ({
        userId: t.field({
            type: 'ID',
            resolve(root: DstkUser, _args, _ctx) {
                return root.user_id;
            },
        }),
        banExpires: t.exposeInt('ban_expires'),
        banReason: t.exposeString('ban_reason'),
        isBanned: t.exposeBoolean('banned'),
        dateCreated: t.field({
            type: 'String',
            resolve(root: DstkUser, _args, _ctx) {
                return root.date_created.toISOString();
            },
        }),
        dateModified: t.field({
            type: 'String',
            resolve(root: DstkUser, _args, _ctx) {
                return root.date_modified.toISOString();
            },
        }),
        email: t.exposeString('email'),
        image: t.exposeString('image'),
        isAdmin: t.exposeBoolean('is_admin'),
        isApproved: t.exposeBoolean('is_approved'),
        isDisabled: t.exposeBoolean('is_disabled'),
        isEmailVerified: t.exposeBoolean('is_email_verified'),
        isMfaEnrolled: t.exposeBoolean('is_mfa_enrolled'),
        realName: t.exposeString('real_name'),
        role: t.exposeString('role'),
        userName: t.exposeString('user_name'),
    }),
});
