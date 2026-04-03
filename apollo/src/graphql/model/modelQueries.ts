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
      const membership = await db
        .selectFrom("dstk_user.members")
        .select("dstk_user.members.id")
        .where("dstk_user.members.user_id", "=", ctx.user.id)
        .where("dstk_user.members.team_id", "=", args.teamId)
        .executeTakeFirst();

      if (!membership) {
        throw new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" });
      }

      const userProjects = await db
        .selectFrom("dstk_user.projects")
        .select("dstk_user.projects.project_id")
        .where("dstk_user.projects.team_id", "=", args.teamId)
        .execute();

      let query = db
        .selectFrom("registry.models")
        .selectAll()
        .where(
          "registry.models.project_id",
          "in",
          userProjects.map(project => project.project_id),
        );

      if (args.modelName) {
        query = query.where(
          "registry.models.model_name",
          "ilike",
          `%${args.modelName}%`,
        );
      }

      if (!args.includeArchived) {
        query = query.where(
          "registry.models.is_archived",
          "is",
          false,
        );
      }

      if (args.after) {
        const [id, dateCreated] = encoder.decode(args.after);

        query = query.where(({ eb, and, or }) =>
          or([
            eb("registry.models.date_created", ">", new Date(dateCreated)),
            and([
              eb("registry.models.date_created", "=", new Date(dateCreated)),
              eb("registry.models.id", ">", Number.parseInt(id)),
            ]),
          ]),
        );
      }

      const mlModels = await query
        .limit(args.first + 1)
        .orderBy("registry.models.date_created", "asc")
        .orderBy("registry.models.id", "asc")
        .execute();

      const hasPreviousPage = !!args.after;
      const hasNextPage = mlModels.length > args.first;

      const lastResult = mlModels[mlModels.length - 2];
      const continuationToken = hasNextPage
        ? encoder.encode(lastResult.id.toString(), lastResult.date_created.toISOString())
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
        .selectFrom("dstk_user.members")
        .select("dstk_user.members.team_id")
        .where("dstk_user.members.user_id", "=", ctx.user.id)
        .execute();

      const userProjects = await db
        .selectFrom("dstk_user.projects")
        .select("dstk_user.projects.project_id")
        .where(
          "dstk_user.projects.team_id",
          "in",
          userTeams.map(edge => edge.team_id),
        )
        .execute();

      return db
        .selectFrom("registry.models")
        .selectAll()
        .where(({ eb, and }) =>
          and([
            eb(
              "registry.models.project_id",
              "in",
              userProjects.map(project => project.project_id),
            ),
            eb("registry.models.model_id", "=", args.modelId),
          ]),
        )
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "MODEL_PERMISSION_ERROR" }),
        );
    },
  }),
}));
