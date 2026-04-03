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
          .selectFrom("dstk_user.projects")
          .select(["dstk_user.projects.project_id", "dstk_user.projects.team_id"])
          .where("dstk_user.projects.project_id", "=", args.data.projectId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
          );

        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              model: ["create"],
            },
            organizationId: project.team_id,
          },
        });

        if (!success) {
          throw new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" });
        }

        const storageProvider = await trx
          .selectFrom("registry.storage_providers")
          .select([
            "registry.storage_providers.provider_id",
            "registry.storage_providers.is_archived",
          ])
          .where(({ eb, and }) =>
            and([
              eb("registry.storage_providers.team_id", "=", project.team_id),
              eb(
                "registry.storage_providers.provider_id",
                "=",
                args.data.storageProviderId,
              ),
            ]),
          )
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROVIDER_NOT_FOUND_ERROR" }),
          );

        if (storageProvider.is_archived === true) {
          throw new RegistryOperationError({ name: "ARCHIVED_STORAGE_ERROR" });
        }

        const mlModel = await trx
          .insertInto("registry.models")
          .values({
            storage_provider_id: args.data.storageProviderId,
            project_id: project.project_id,
            model_name: args.data.modelName,
            description: args.data.description,
            created_by_id: ctx.user.id,
            modified_by_id: ctx.user.id,
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
          .select(["registry.models.project_id", "registry.models.is_archived"])
          .where("registry.models.model_id", "=", args.modelId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" }),
          );

        if (mlModel.is_archived === true) {
          throw new RegistryOperationError({ name: "ARCHIVED_MODEL_ERROR" });
        }

        const project = await trx
          .selectFrom("dstk_user.projects")
          .select("dstk_user.projects.team_id")
          .where("dstk_user.projects.project_id", "=", mlModel.project_id)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
          );

        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              model: ["edit"],
            },
            organizationId: project.team_id,
          },
        });

        if (!success) {
          throw new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" });
        }

        const storageProvider = await trx
          .selectFrom("registry.storage_providers")
          .select("registry.storage_providers.is_archived")
          .where(({ eb, and }) =>
            and([
              eb("registry.storage_providers.team_id", "=", project.team_id),
              eb(
                "registry.storage_providers.provider_id",
                "=",
                args.data.storageProviderId,
              ),
            ]),
          )
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROVIDER_NOT_FOUND_ERROR" }),
          );

        if (storageProvider.is_archived === true) {
          throw new RegistryOperationError({ name: "ARCHIVED_STORAGE_ERROR" });
        }

        const result = await trx
          .updateTable("registry.models")
          .set({
            model_name: args.data.modelName,
            description: args.data.description,
            storage_provider_id: args.data.storageProviderId,
            project_id: args.data.projectId,
            date_modified: new Date(),
            modified_by_id: ctx.user.id,
          })
          .where("registry.models.model_id", "=", args.modelId)
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
          .select(["registry.models.project_id", "registry.models.is_archived"])
          .where("registry.models.model_id", "=", args.modelId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" }),
          );

        const project = await trx
          .selectFrom("dstk_user.projects")
          .select("dstk_user.projects.team_id")
          .where("dstk_user.projects.project_id", "=", mlModel.project_id)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
          );

        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              model: ["archive"],
            },
            organizationId: project.team_id,
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
            is_archived: !mlModel.is_archived,
            date_modified: new Date(),
            modified_by_id: ctx.user.id,
          })
          .where("registry.models.model_id", "=", args.modelId)
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
