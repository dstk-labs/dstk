import type { Selectable } from "kysely";
import type { RegistryStorageProviders } from "../../db/db.js";
import { builder } from "../../builder.js";
import { db } from "../../db/kysely.js";
import { Security } from "../../utils/encryption.js";
import { User } from "../user/user.js";

const EncryptoMatic = new Security();

export type KyselyStorageProvider = Selectable<RegistryStorageProviders>;

export const StorageProvider = builder.objectRef<KyselyStorageProvider>("StorageProvider");

builder.objectType(StorageProvider, {
  fields: t => ({
    providerId: t.field({
      type: "ID",
      resolve(root: KyselyStorageProvider, _args, _ctx) {
        return root.providerId;
      },
    }),
    endpointUrl: t.exposeString("endpointUrl"),
    region: t.exposeString("region"),
    bucket: t.exposeString("bucket"),

    accessKeyId: t.string({
      resolve(root: KyselyStorageProvider, _args, _ctx) {
        return EncryptoMatic.decrypt(root.accessKeyId);
      },
    }),

    createdBy: t.field({
      type: User,
      async resolve(root: KyselyStorageProvider, _args, _ctx) {
        const user = await db
          .selectFrom("dstkUser.users")
          .selectAll()
          .where("dstkUser.users.id", "=", root.createdById)
          .executeTakeFirstOrThrow();
        return user;
      },
    }),
    modifiedBy: t.field({
      type: User,
      async resolve(root: KyselyStorageProvider, _args, _ctx) {
        const user = await db
          .selectFrom("dstkUser.users")
          .selectAll()
          .where("dstkUser.users.id", "=", root.modifiedById)
          .executeTakeFirstOrThrow();
        return user;
      },
    }),
    owner: t.field({
      type: User,
      async resolve(root: KyselyStorageProvider, _args, _ctx) {
        const user = await db
          .selectFrom("dstkUser.users")
          .selectAll()
          .where("dstkUser.users.id", "=", root.ownerId)
          .executeTakeFirstOrThrow();
        return user;
      },
    }),
    teamId: t.exposeString("teamId"),
    dateCreated: t.field({
      type: "String",
      resolve(root: KyselyStorageProvider, _args, _ctx) {
        return root.dateCreated.toISOString();
      },
    }),
    dateModified: t.field({
      type: "String",
      resolve(root: KyselyStorageProvider, _args, _ctx) {
        return root.dateModified.toISOString();
      },
    }),
    isArchived: t.exposeBoolean("isArchived"),
  }),
});
