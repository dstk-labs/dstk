import { builder } from "../../builder.js";
import { db } from "../../db/kysely.js";
import { auth } from "../../utils/auth.js";
import { RegistryOperationError } from "../../utils/errors.js";
import { MLModel } from "./model.js";

export const ModelInputType = builder.inputType("ModelInput", {
  fields: t => ({
    storageProviderId: t.string({ required: true }),
    projectId: t.string({ required: true }),
    modelName: t.string({ required: true }),
    description: t.string({ required: true }),
  }),
});

builder.mutationFields(t => ({
  createModel: t.field({
    type: MLModel,
    authScopes: {
      loggedIn: true,
    },
    args: {
      data: t.arg({ type: ModelInputType, required: true }),
    },
    async resolve(_root, args, ctx) {
      const results = await db.transaction().execute(async (trx) => {
        const project = await trx
          .selectFrom("dstkUser.projects")
          .select(["dstkUser.projects.projectId", "dstkUser.projects.teamId"])
          .where("dstkUser.projects.projectId", "=", args.data.projectId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
          );

        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              model: ["create"],
            },
            organizationId: project.teamId,
          },
        });

        if (!success) {
          throw new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" });
        }

        const storageProvider = await trx
          .selectFrom("registry.storageProviders")
          .select([
            "registry.storageProviders.providerId",
            "registry.storageProviders.isArchived",
          ])
          .where(({ eb, and }) =>
            and([
              eb("registry.storageProviders.teamId", "=", project.teamId),
              eb(
                "registry.storageProviders.providerId",
                "=",
                args.data.storageProviderId,
              ),
            ]),
          )
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROVIDER_NOT_FOUND_ERROR" }),
          );

        if (storageProvider.isArchived === true) {
          throw new RegistryOperationError({ name: "ARCHIVED_STORAGE_ERROR" });
        }

        const mlModel = await trx
          .insertInto("registry.models")
          .values({
            storageProviderId: args.data.storageProviderId,
            projectId: project.projectId,
            modelName: args.data.modelName,
            description: args.data.description,
            createdById: ctx.user.id,
            modifiedById: ctx.user.id,
          })
          .returningAll()
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "MODEL_WRITE_ERROR" }),
          );

        return mlModel;
      });
      return results;
    },
  }),
  editModel: t.field({
    type: MLModel,
    authScopes: {
      loggedIn: true,
    },
    args: {
      modelId: t.arg.string({ required: true }),
      data: t.arg({ type: ModelInputType, required: true }),
    },
    async resolve(_root, args, ctx) {
      const results = await db.transaction().execute(async (trx) => {
        const mlModel = await trx
          .selectFrom("registry.models")
          .select(["registry.models.projectId", "registry.models.isArchived"])
          .where("registry.models.modelId", "=", args.modelId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" }),
          );

        if (mlModel.isArchived === true) {
          throw new RegistryOperationError({ name: "ARCHIVED_MODEL_ERROR" });
        }

        const project = await trx
          .selectFrom("dstkUser.projects")
          .select("dstkUser.projects.teamId")
          .where("dstkUser.projects.projectId", "=", mlModel.projectId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
          );

        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              model: ["edit"],
            },
            organizationId: project.teamId,
          },
        });

        if (!success) {
          throw new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" });
        }

        const storageProvider = await trx
          .selectFrom("registry.storageProviders")
          .select("registry.storageProviders.isArchived")
          .where(({ eb, and }) =>
            and([
              eb("registry.storageProviders.teamId", "=", project.teamId),
              eb(
                "registry.storageProviders.providerId",
                "=",
                args.data.storageProviderId,
              ),
            ]),
          )
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROVIDER_NOT_FOUND_ERROR" }),
          );

        if (storageProvider.isArchived === true) {
          throw new RegistryOperationError({ name: "ARCHIVED_STORAGE_ERROR" });
        }

        const result = await trx
          .updateTable("registry.models")
          .set({
            modelName: args.data.modelName,
            description: args.data.description,
            storageProviderId: args.data.storageProviderId,
            projectId: args.data.projectId,
            dateModified: new Date(),
            modifiedById: ctx.user.id,
          })
          .where("registry.models.modelId", "=", args.modelId)
          .returningAll()
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "MODEL_WRITE_ERROR" }),
          );

        return result;
      });

      return results;
    },
  }),
  archiveModel: t.field({
    type: MLModel,
    authScopes: {
      loggedIn: true,
    },
    args: {
      modelId: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      const results = await db.transaction().execute(async (trx) => {
        const mlModel = await trx
          .selectFrom("registry.models")
          .select(["registry.models.projectId", "registry.models.isArchived"])
          .where("registry.models.modelId", "=", args.modelId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" }),
          );

        const project = await trx
          .selectFrom("dstkUser.projects")
          .select("dstkUser.projects.teamId")
          .where("dstkUser.projects.projectId", "=", mlModel.projectId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
          );

        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              model: ["archive"],
            },
            organizationId: project.teamId,
          },
        });

        if (!success) {
          throw new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" });
        }

        // Intentionally don't throw an error here on archived storage
        // providers. It's not unreasonable to want to mark old assets
        // as archived if their parent blob storage goes bye-bye
        const result = await trx
          .updateTable("registry.models")
          .set({
            isArchived: !mlModel.isArchived,
            dateModified: new Date(),
            modifiedById: ctx.user.id,
          })
          .where("registry.models.modelId", "=", args.modelId)
          .returningAll()
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "MODEL_WRITE_ERROR" }),
          );

        return result;
      });

      return results;
    },
  }),
}));
