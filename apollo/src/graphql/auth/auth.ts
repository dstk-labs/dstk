import type { Insertable, Updateable, Selectable } from 'kysely';
import { builder } from '../../builder.js';
import type { DstkUserApiKeys } from '../../db/db.js';
import { type DstkUser, User } from '../user/user.js';
import { db } from '../../db/kysely.js';

export type DstkApiKey = Selectable<DstkUserApiKeys>;
export type InsertDstkApiKey = Insertable<DstkUserApiKeys>;
export type UpdateDstkApiKey = Updateable<DstkUserApiKeys>;

export const ApiKey = builder.objectRef<DstkApiKey>('ApiKey');

builder.objectType(ApiKey, {
    fields: (t) => ({
        apiKeyId: t.field({
            type: 'ID',
            resolve(root: DstkApiKey, _args, _ctx) {
                return root.api_key_id;
            },
        }),
        dateCreated: t.field({
            type: 'String',
            resolve(root: DstkApiKey, _args, _ctx) {
                return root.date_created.toISOString();
            },
        }),
        dateModified: t.field({
            type: 'String',
            resolve(root: DstkApiKey, _args, _ctx) {
                return root.date_modified.toISOString();
            },
        }),
        enabled: t.exposeBoolean('enabled'),
        expiresAt: t.field({
            type: 'String',
            resolve(root: DstkApiKey, _args, _ctx) {
                return root.expires_at?.toISOString();
            },
        }),
        key: t.exposeString('key'),
        lastRefillAt: t.field({
            type: 'String',
            resolve(root: DstkApiKey, _args, _ctx) {
                return root.last_refill_at?.toISOString();
            },
        }),
        lastRequest: t.field({
            type: 'String',
            resolve(root: DstkApiKey, _args, _ctx) {
                return root.last_request?.toISOString();
            },
        }),
        metadata: t.exposeString('metadata'),
        name: t.exposeString('name'),
        permissions: t.exposeString('permissions'),
        prefix: t.exposeString('prefix'),
        rateLimitEnabled: t.exposeBoolean('rate_limit_enabled'),
        rateLimitMax: t.exposeInt('rate_limit_max'),
        rateLimitTimeWindow: t.exposeInt('rate_limit_time_window'),
        refillAmount: t.exposeInt('rate_limit_time_window'),
        refillInterval: t.exposeInt('refill_interval'),
        remaining: t.exposeInt('remaining'),
        requestCount: t.exposeInt('request_count'),
        start: t.exposeString('start'),
        userId: t.field({
            type: User,
            async resolve(root: DstkApiKey, _args, _ctx) {
                const result = await db
                    .selectFrom('dstk_user.api_keys')
                    .leftJoin(
                        'dstk_user.user',
                        'dstk_user.api_keys.user_id',
                        'dstk_user.user.user_id',
                    )
                    .where('dstk_user.api_keys.api_key_id', '=', root.api_key_id)
                    .selectAll('dstk_user.user')
                    .executeTakeFirstOrThrow();

                return result as DstkUser;
            },
        }),
    }),
});
