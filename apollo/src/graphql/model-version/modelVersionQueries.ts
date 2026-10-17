import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";
import { queryNamespace } from "@/graphql/misc/namespace.js";
import { pageArgs, paginate } from "@/graphql/misc/pagination.js";
import { RegistryOperationError } from "@/utils/errors.js";
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

      return paginate(query, ["registry.modelVersions.numericVersion"], args);
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
}));
