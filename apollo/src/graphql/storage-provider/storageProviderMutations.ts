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
          .selectFrom("dstkUser.teams")
          .select("dstkUser.teams.isArchived")
          .where("dstkUser.teams.id", "=", args.data.teamId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" }),
          );

        if (team.isArchived) {
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
          .insertInto("registry.storageProviders")
          .values({
            endpointUrl: args.data.endpointUrl,
            region: args.data.region,
            bucket: args.data.bucket,
            accessKeyId: encryptedAccessKeyId,
            secretAccessKey: encryptedSecretAccessKey,
            createdById: ctx.user.id,
            modifiedById: ctx.user.id,
            ownerId: ctx.user.id,
            teamId: args.data.teamId,
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
          .selectFrom("registry.storageProviders")
          .select("registry.storageProviders.teamId")
          .where("registry.storageProviders.providerId", "=", args.data.providerId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROVIDER_NOT_FOUND_ERROR" }),
          );

        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              storageProvider: ["edit"],
            },
            organizationId: storageProvider.teamId,
          },
        });

        if (!success) {
          throw new RegistryOperationError({ name: "PROVIDER_PERMISSION_ERROR" });
        }

        const encryptedAccessKeyId = EncryptoMatic.encrypt(args.data.accessKeyId);
        const encryptedSecretAccessKey = EncryptoMatic.encrypt(args.data.secretAccessKey);

        const result = await trx
          .updateTable("registry.storageProviders")
          .set({
            accessKeyId: encryptedAccessKeyId,
            secretAccessKey: encryptedSecretAccessKey,
            dateModified: new Date(),
            modifiedById: ctx.user.id,
          })
          .where("registry.storageProviders.providerId", "=", args.data.providerId)
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
          .selectFrom("registry.storageProviders")
          .select([
            "registry.storageProviders.isArchived",
            "registry.storageProviders.teamId",
          ])
          .where("registry.storageProviders.providerId", "=", args.providerId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROVIDER_NOT_FOUND_ERROR" }),
          );

        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              storageProvider: ["archive"],
            },
            organizationId: storageProvider.teamId,
          },
        });

        if (!success) {
          throw new RegistryOperationError({ name: "PROVIDER_PERMISSION_ERROR" });
        }

        const result = await trx
          .updateTable("registry.storageProviders")
          .set({
            isArchived: !storageProvider.isArchived,
            secretAccessKey: EncryptoMatic.encrypt("<DELETED>"),
            accessKeyId: EncryptoMatic.encrypt("<DELETED>"),
            dateModified: new Date(),
            modifiedById: ctx.user.id,
          })
          .where("registry.storageProviders.providerId", "=", args.providerId)
          .returningAll()
          .executeTakeFirstOrThrow();

        return result;
      });

      return results;
    },
  }),
}));
