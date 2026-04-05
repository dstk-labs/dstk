import { builder } from "../../builder.js";
import { db } from "../../db/kysely.js";
import { Encoder } from "../../utils/encoder.js";
import { RegistryOperationError } from "../../utils/errors.js";
import { MLModelVersion } from "./modelVersion.js";
import { MLModelVersionConnection } from "./modelVersionConnection.js";

const encoder = new Encoder();

builder.queryFields(t => ({
  listMLModelVersions: t.field({
    type: MLModelVersionConnection,
    authScopes: {
      loggedIn: true,
    },
    args: {
      modelId: t.arg.string({ required: true }),
      includeArchived: t.arg.boolean({ required: true, defaultValue: false }),
      // TODO: Putting defaultValue & required overrides defaultValue
      first: t.arg({
        type: "Limit",
        defaultValue: 10,
        required: true,
      }),
      after: t.arg.string(),
    },
    async resolve(_root, args, ctx) {
      const parentModel = await db
        .selectFrom("registry.models")
        .select("registry.models.project_id")
        .where("registry.models.model_id", "=", args.modelId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" }),
        );

      const project = await db
        .selectFrom("dstk_user.projects")
        .select("dstk_user.projects.team_id")
        .where("dstk_user.projects.project_id", "=", parentModel.project_id)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
        );

      await db
        .selectFrom("dstk_user.members")
        .select("dstk_user.members.id")
        .where("dstk_user.members.user_id", "=", ctx.user.id)
        .where("dstk_user.members.team_id", "=", project.team_id)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "VERSION_PERMISSION_ERROR" }),
        );

      let query = db
        .selectFrom("registry.model_versions")
        .selectAll()
        .where("registry.model_versions.model_id", "=", args.modelId);

      if (!args.includeArchived) {
        query = query.where(
          "registry.model_versions.is_archived",
          "is",
          false,
        );
      }

      if (args.after) {
        const [numericVersion] = encoder.decode(args.after);
        query = query.where(
          "registry.model_versions.numeric_version",
          ">",
          Number.parseInt(numericVersion),
        );
      }

      const mlModelVersions = await query
        .limit(args.first + 1)
        .orderBy("registry.model_versions.numeric_version", "asc")
        .execute();

      const hasPreviousPage = !!args.after;
      const hasNextPage = mlModelVersions.length > args.first;

      const lastResult = mlModelVersions[mlModelVersions.length - 2];
      const continuationToken = hasNextPage ? encoder.encode(lastResult.numeric_version) : undefined;

      return {
        edges: mlModelVersions.slice(0, args.first).map(mlModelVersion => ({
          cursor: continuationToken,
          node: mlModelVersion,
        })),
        pageInfo: {
          hasPreviousPage,
          hasNextPage,
          continuationToken,
        },
      };
    },
  }),
  getMLModelVersion: t.field({
    type: MLModelVersion,
    authScopes: {
      loggedIn: true,
    },
    args: {
      modelVersionId: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      const mlModelVersion = await db
        .selectFrom("registry.model_versions")
        .selectAll()
        .where("registry.model_versions.model_version_id", "=", args.modelVersionId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "VERSION_PERMISSION_ERROR" }),
        );

      const parentModel = await db
        .selectFrom("registry.models")
        .select("registry.models.project_id")
        .where("registry.models.model_id", "=", mlModelVersion.model_id)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" }),
        );

      const project = await db
        .selectFrom("dstk_user.projects")
        .select("dstk_user.projects.team_id")
        .where("dstk_user.projects.project_id", "=", parentModel.project_id)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
        );

      await db
        .selectFrom("dstk_user.members")
        .select("dstk_user.members.id")
        .where("dstk_user.members.user_id", "=", ctx.user.id)
        .where("dstk_user.members.team_id", "=", project.team_id)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "VERSION_PERMISSION_ERROR" }),
        );

      return mlModelVersion;
    },
  }),
}));
