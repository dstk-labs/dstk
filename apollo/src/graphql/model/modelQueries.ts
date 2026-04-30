import { builder } from "../../builder.js";
import { db } from "../../db/kysely.js";
import { Encoder } from "../../utils/encoder.js";
import { RegistryOperationError } from "../../utils/errors.js";
import { MLModel } from "./model.js";
import { MLModelConnection } from "./modelConnection.js";

const encoder = new Encoder();

builder.queryFields(t => ({
  listMLModels: t.field({
    type: MLModelConnection,
    authScopes: {
      loggedIn: true,
    },
    args: {
      includeArchived: t.arg.boolean({ required: true, defaultValue: false }),
      modelName: t.arg.string(),
      first: t.arg({
        type: "Limit",
        defaultValue: 10,
        required: true,
      }),
      after: t.arg.string(),
      teamId: t.arg.string({ required: true }),
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

      let query = db
        .selectFrom("registry.models")
        .selectAll()
        .where(
          "registry.models.projectId",
          "in",
          userProjects.map(project => project.projectId),
        );

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

      if (args.after) {
        const [id, dateCreated] = encoder.decode(args.after);

        query = query.where(({ eb, and, or }) =>
          or([
            eb("registry.models.dateCreated", ">", new Date(dateCreated)),
            and([
              eb("registry.models.dateCreated", "=", new Date(dateCreated)),
              eb("registry.models.id", ">", Number.parseInt(id)),
            ]),
          ]),
        );
      }

      const mlModels = await query
        .limit(args.first + 1)
        .orderBy("registry.models.dateCreated", "asc")
        .orderBy("registry.models.id", "asc")
        .execute();

      const hasPreviousPage = !!args.after;
      const hasNextPage = mlModels.length > args.first;

      const lastResult = mlModels[mlModels.length - 2];
      const continuationToken = hasNextPage
        ? encoder.encode(lastResult.id.toString(), lastResult.dateCreated.toISOString())
        : undefined;

      return {
        edges: mlModels.slice(0, args.first).map(mlModel => ({
          cursor: continuationToken,
          node: mlModel,
        })),
        pageInfo: {
          hasPreviousPage,
          hasNextPage,
          continuationToken,
        },
      };
    },
  }),
  getMLModel: t.field({
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

      const userProjects = await db
        .selectFrom("dstkUser.projects")
        .select("dstkUser.projects.projectId")
        .where(
          "dstkUser.projects.teamId",
          "in",
          userTeams.map(edge => edge.teamId),
        )
        .execute();

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
