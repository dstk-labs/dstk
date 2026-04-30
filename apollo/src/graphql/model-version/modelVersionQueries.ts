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

      if (args.after) {
        const [numericVersion] = encoder.decode(args.after);
        query = query.where(
          "registry.modelVersions.numericVersion",
          ">",
          Number.parseInt(numericVersion),
        );
      }

      const mlModelVersions = await query
        .limit(args.first + 1)
        .orderBy("registry.modelVersions.numericVersion", "asc")
        .execute();

      const hasPreviousPage = !!args.after;
      const hasNextPage = mlModelVersions.length > args.first;

      const lastResult = mlModelVersions[mlModelVersions.length - 2];
      const continuationToken = hasNextPage ? encoder.encode(lastResult.numericVersion) : undefined;

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
