import { builder } from "../../builder.js";
import { db } from "../../db/kysely.js";
import { auth } from "../../utils/auth.js";
import { Security } from "../../utils/encryption.js";
import { RegistryOperationError } from "../../utils/errors.js";
import { StorageProvider } from "./storageProvider.js";

const EncryptoMatic = new Security();

export const StorageProviderInputType = builder.inputType("StorageProviderInput", {
  fields: t => ({
    endpointUrl: t.string({ required: true }),
    region: t.string({ required: true }),
    bucket: t.string({ required: true }),
    accessKeyId: t.string({ required: true }),
    secretAccessKey: t.string({ required: true }),
    teamId: t.string({ required: true }),
  }),
});

export const EditStorageProviderInputType = builder.inputType("EditStorageProviderInput", {
  fields: t => ({
    providerId: t.string({ required: true }),
    accessKeyId: t.string({ required: true }),
    secretAccessKey: t.string({ required: true }),
  }),
});

builder.mutationFields(t => ({
  createStorageProvider: t.field({
    type: StorageProvider,
    authScopes: {
      loggedIn: true,
    },
    args: {
      data: t.arg({ type: StorageProviderInputType, required: true }),
    },
    async resolve(_root, args, ctx) {
      const results = await db.transaction().execute(async (trx) => {
        const team = await trx
          .selectFrom("dstk_user.teams")
          .select("dstk_user.teams.is_archived")
          .where("dstk_user.teams.id", "=", args.data.teamId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" }),
          );

        if (team.is_archived) {
          throw new RegistryOperationError({ name: "ARCHIVED_TEAM_ERROR" });
        }

        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              storageProvider: ["create"],
            },
            organizationId: args.data.teamId,
          },
        });

        if (!success) {
          throw new RegistryOperationError({ name: "PROVIDER_PERMISSION_ERROR" });
        }

        const encryptedAccessKeyId = EncryptoMatic.encrypt(args.data.accessKeyId);
        const encryptedSecretAccessKey = EncryptoMatic.encrypt(args.data.secretAccessKey);

        const storageProvider = await trx
          .insertInto("registry.storage_providers")
          .values({
            endpoint_url: args.data.endpointUrl,
            region: args.data.region,
            bucket: args.data.bucket,
            access_key_id: encryptedAccessKeyId,
            secret_access_key: encryptedSecretAccessKey,
            created_by_id: ctx.user.id,
            modified_by_id: ctx.user.id,
            owner_id: ctx.user.id,
            team_id: args.data.teamId,
          })
          .returningAll()
          .executeTakeFirstOrThrow();

        return storageProvider;
      });

      return results;
    },
  }),
  editStorageProvider: t.field({
    type: StorageProvider,
    authScopes: {
      loggedIn: true,
    },
    args: {
      data: t.arg({ type: EditStorageProviderInputType, required: true }),
    },
    async resolve(_root, args, ctx) {
      const results = await db.transaction().execute(async (trx) => {
        const storageProvider = await trx
          .selectFrom("registry.storage_providers")
          .select("registry.storage_providers.team_id")
          .where("registry.storage_providers.provider_id", "=", args.data.providerId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROVIDER_NOT_FOUND_ERROR" }),
          );

        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              storageProvider: ["edit"],
            },
            organizationId: storageProvider.team_id,
          },
        });

        if (!success) {
          throw new RegistryOperationError({ name: "PROVIDER_PERMISSION_ERROR" });
        }

        const encryptedAccessKeyId = EncryptoMatic.encrypt(args.data.accessKeyId);
        const encryptedSecretAccessKey = EncryptoMatic.encrypt(args.data.secretAccessKey);

        const result = await trx
          .updateTable("registry.storage_providers")
          .set({
            access_key_id: encryptedAccessKeyId,
            secret_access_key: encryptedSecretAccessKey,
            date_modified: new Date(),
            modified_by_id: ctx.user.id,
          })
          .where("registry.storage_providers.provider_id", "=", args.data.providerId)
          .returningAll()
          .executeTakeFirstOrThrow();

        return result;
      });

      return results;
    },
  }),
  archiveStorageProvider: t.field({
    type: StorageProvider,
    authScopes: {
      loggedIn: true,
    },
    args: {
      providerId: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      const results = await db.transaction().execute(async (trx) => {
        const storageProvider = await trx
          .selectFrom("registry.storage_providers")
          .select([
            "registry.storage_providers.is_archived",
            "registry.storage_providers.team_id",
          ])
          .where("registry.storage_providers.provider_id", "=", args.providerId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROVIDER_NOT_FOUND_ERROR" }),
          );

        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              storageProvider: ["archive"],
            },
            organizationId: storageProvider.team_id,
          },
        });

        if (!success) {
          throw new RegistryOperationError({ name: "PROVIDER_PERMISSION_ERROR" });
        }

        const result = await trx
          .updateTable("registry.storage_providers")
          .set({
            is_archived: !storageProvider.is_archived,
            secret_access_key: EncryptoMatic.encrypt("<DELETED>"),
            access_key_id: EncryptoMatic.encrypt("<DELETED>"),
            date_modified: new Date(),
            modified_by_id: ctx.user.id,
          })
          .where("registry.storage_providers.provider_id", "=", args.providerId)
          .returningAll()
          .executeTakeFirstOrThrow();

        return result;
      });

      return results;
    },
  }),
}));
