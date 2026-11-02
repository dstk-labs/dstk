import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";
import { queryNamespace } from "@/graphql/misc/namespace.js";
import { pageArgs, paginate } from "@/graphql/misc/pagination.js";
import { auth } from "@/utils/auth.js";
import { RegistryOperationError } from "@/utils/errors.js";
import { CreatePresignedURLForDownload } from "@/utils/s3-api.js";
import { MLModelVersion } from "./modelVersion.js";
import { MLModelVersionConnection } from "./modelVersionConnection.js";

const ModelVersionQuery = queryNamespace("modelVersion", "ModelVersionQuery");

builder.objectFields(ModelVersionQuery, t => ({
  list: t.field({
    type: MLModelVersionConnection,
    authScopes: {
      loggedIn: true,
    },
    args: {
      modelId: t.arg.string({ required: true }),
      includeArchived: t.arg.boolean({ required: true, defaultValue: false }),
      ...pageArgs,
    },
    async resolve(_root, args, ctx) {
      const parentModel = await db
        .selectFrom("registry.models")
        .select("registry.models.projectId")
        .where("registry.models.modelId", "=", args.modelId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" }),
        );

      const project = await db
        .selectFrom("dstkUser.projects")
        .select("dstkUser.projects.teamId")
        .where("dstkUser.projects.projectId", "=", parentModel.projectId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
        );

      await db
        .selectFrom("dstkUser.members")
        .select("dstkUser.members.id")
        .where("dstkUser.members.userId", "=", ctx.user.id)
        .where("dstkUser.members.teamId", "=", project.teamId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "VERSION_PERMISSION_ERROR" }),
        );

      let query = db
        .selectFrom("registry.modelVersions")
        .selectAll()
        .where("registry.modelVersions.modelId", "=", args.modelId);

      if (!args.includeArchived) {
        query = query.where(
          "registry.modelVersions.isArchived",
          "is",
          false,
        );
      }

      return paginate(query, ["registry.modelVersions.numericVersion"], args, "desc");
    },
  }),
  get: t.field({
    type: MLModelVersion,
    authScopes: {
      loggedIn: true,
    },
    args: {
      modelVersionId: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      const mlModelVersion = await db
        .selectFrom("registry.modelVersions")
        .selectAll()
        .where("registry.modelVersions.modelVersionId", "=", args.modelVersionId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "VERSION_PERMISSION_ERROR" }),
        );

      const parentModel = await db
        .selectFrom("registry.models")
        .select("registry.models.projectId")
        .where("registry.models.modelId", "=", mlModelVersion.modelId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" }),
        );

      const project = await db
        .selectFrom("dstkUser.projects")
        .select("dstkUser.projects.teamId")
        .where("dstkUser.projects.projectId", "=", parentModel.projectId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
        );

      await db
        .selectFrom("dstkUser.members")
        .select("dstkUser.members.id")
        .where("dstkUser.members.userId", "=", ctx.user.id)
        .where("dstkUser.members.teamId", "=", project.teamId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "VERSION_PERMISSION_ERROR" }),
        );

      return mlModelVersion;
    },
  }),
  downloadURL: t.field({
    type: "String",
    authScopes: {
      loggedIn: true,
    },
    args: {
      modelVersionId: t.arg.string({ required: true }),
      filename: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      if (!args.filename) {
        throw new RegistryOperationError({ name: "MISSING_FILENAME_ERROR" });
      }

      const mlModelVersion = await db
        .selectFrom("registry.modelVersions")
        .select(["registry.modelVersions.modelId", "registry.modelVersions.s3Prefix"])
        .where("registry.modelVersions.modelVersionId", "=", args.modelVersionId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "VERSION_PERMISSION_ERROR" }),
        );

      const parentModel = await db
        .selectFrom("registry.models")
        .select(["registry.models.projectId", "registry.models.storageProviderId"])
        .where("registry.models.modelId", "=", mlModelVersion.modelId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" }),
        );

      const project = await db
        .selectFrom("dstkUser.projects")
        .select("dstkUser.projects.teamId")
        .where("dstkUser.projects.projectId", "=", parentModel.projectId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
        );

      const { success } = await auth.api.hasPermission({
        headers: ctx.headers,
        body: {
          permissions: {
            modelVersion: ["download"],
          },
          organizationId: project.teamId,
        },
      });

      if (!success) {
        throw new RegistryOperationError({ name: "VERSION_PERMISSION_ERROR" });
      }

      const modelStorageProvider = await db
        .selectFrom("registry.storageProviders")
        .selectAll()
        .where(
          "registry.storageProviders.providerId",
          "=",
          parentModel.storageProviderId,
        )
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "PROVIDER_NOT_FOUND_ERROR" }),
        );

      return CreatePresignedURLForDownload(
        modelStorageProvider,
        `${mlModelVersion.s3Prefix}/${args.filename}`,
      );
    },
  }),
}));
