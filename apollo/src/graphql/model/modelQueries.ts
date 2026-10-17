import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";
import { queryNamespace } from "@/graphql/misc/namespace.js";
import { EMPTY_PAGE, pageArgs, paginate } from "@/graphql/misc/pagination.js";
import { RegistryOperationError } from "@/utils/errors.js";
import { MLModel } from "./model.js";
import { MLModelConnection } from "./modelConnection.js";

const ModelQuery = queryNamespace("model", "ModelQuery");

builder.objectFields(ModelQuery, t => ({
  list: t.field({
    type: MLModelConnection,
    authScopes: {
      loggedIn: true,
    },
    args: {
      includeArchived: t.arg.boolean({ required: true, defaultValue: false }),
      modelName: t.arg.string(),
      ...pageArgs,
      teamId: t.arg.string({ required: true }),
      projectId: t.arg.string(),
    },
    async resolve(_root, args, ctx) {
      await db
        .selectFrom("dstkUser.members")
        .select("dstkUser.members.id")
        .where("dstkUser.members.userId", "=", ctx.user.id)
        .where("dstkUser.members.teamId", "=", args.teamId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" }),
        );

      const userProjects = await db
        .selectFrom("dstkUser.projects")
        .select("dstkUser.projects.projectId")
        .where("dstkUser.projects.teamId", "=", args.teamId)
        .execute();

      if (userProjects.length === 0) {
        return EMPTY_PAGE;
      }

      let query = db
        .selectFrom("registry.models")
        .selectAll()
        .where(
          "registry.models.projectId",
          "in",
          userProjects.map(project => project.projectId),
        );

      if (args.projectId) {
        query = query.where("registry.models.projectId", "=", args.projectId);
      }

      if (args.modelName) {
        query = query.where(
          "registry.models.modelName",
          "ilike",
          `%${args.modelName}%`,
        );
      }

      if (!args.includeArchived) {
        query = query.where(
          "registry.models.isArchived",
          "is",
          false,
        );
      }

      return paginate(query, ["registry.models.dateCreated", "registry.models.id"], args);
    },
  }),
  get: t.field({
    type: MLModel,
    authScopes: {
      loggedIn: true,
    },
    args: {
      modelId: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      const userTeams = await db
        .selectFrom("dstkUser.members")
        .select("dstkUser.members.teamId")
        .where("dstkUser.members.userId", "=", ctx.user.id)
        .execute();

      if (userTeams.length === 0) {
        throw new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" });
      }

      const userProjects = await db
        .selectFrom("dstkUser.projects")
        .select("dstkUser.projects.projectId")
        .where(
          "dstkUser.projects.teamId",
          "in",
          userTeams.map(edge => edge.teamId),
        )
        .execute();

      if (userProjects.length === 0) {
        throw new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" });
      }

      return db
        .selectFrom("registry.models")
        .selectAll()
        .where(({ eb, and }) =>
          and([
            eb(
              "registry.models.projectId",
              "in",
              userProjects.map(project => project.projectId),
            ),
            eb("registry.models.modelId", "=", args.modelId),
          ]),
        )
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" }),
        );
    },
  }),
}));
