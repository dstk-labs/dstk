import { builder } from '../../builder.js';
import { Security } from '../../utils/encryption.js';
import type { RegistryStorageProviders } from '../../db/db.js';
import type { Selectable } from 'kysely';
import { User } from '../user/user.js';
import { db } from '../../db/kysely.js';

const EncryptoMatic = new Security();

export type KyselyStorageProvider = Selectable<RegistryStorageProviders>;

export const StorageProvider = builder.objectRef<KyselyStorageProvider>('StorageProvider');

builder.objectType(StorageProvider, {
    fields: (t) => ({
        providerId: t.field({
            type: 'ID',
            resolve(root: KyselyStorageProvider, _args, _ctx) {
                return root.provider_id;
            },
        }),
        endpointUrl: t.exposeString('endpoint_url'),
        region: t.exposeString('region'),
        bucket: t.exposeString('bucket'),

        accessKeyId: t.string({
            resolve(root: KyselyStorageProvider, _args, _ctx) {
                return EncryptoMatic.decrypt(root.access_key_id);
            },
        }),

        createdBy: t.field({
            type: User,
            async resolve(root: KyselyStorageProvider, _args, _ctx) {
                const user = await db
                    .selectFrom('dstk_user.user')
                    .selectAll()
                    .where('dstk_user.user.user_id', '=', root.created_by_id)
                    .executeTakeFirstOrThrow();
                return user;
            },
        }),
        modifiedBy: t.field({
            type: User,
            async resolve(root: KyselyStorageProvider, _args, _ctx) {
                const user = await db
                    .selectFrom('dstk_user.user')
                    .selectAll()
                    .where('dstk_user.user.user_id', '=', root.modified_by_id)
                    .executeTakeFirstOrThrow();
                return user;
            },
        }),
        owner: t.field({
            type: User,
            async resolve(root: KyselyStorageProvider, _args, _ctx) {
                const user = await db
                    .selectFrom('dstk_user.user')
                    .selectAll()
                    .where('dstk_user.user.user_id', '=', root.owner_id)
                    .executeTakeFirstOrThrow();
                return user;
            },
        }),
        teamId: t.exposeString('team_id'),
        dateCreated: t.field({
            type: 'String',
            resolve(root: KyselyStorageProvider, _args, _ctx) {
                return root.date_created.toISOString();
            },
        }),
        dateModified: t.field({
            type: 'String',
            resolve(root: KyselyStorageProvider, _args, _ctx) {
                return root.date_modified.toISOString();
            },
        }),
        isArchived: t.exposeBoolean('is_archived'),
    }),
});
