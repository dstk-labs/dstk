import type { Expression, SqlBool } from "kysely";
import { builder } from "../../builder.js";
import { db } from "../../db/kysely.js";
import { Encoder } from "../../utils/encoder.js";
import { RegistryOperationError } from "../../utils/errors.js";
import { Project } from "./project.js";
import { ProjectConnection } from "./projectConnection.js";

const encoder = new Encoder();

builder.queryFields(t => ({
  listProjects: t.field({
    type: ProjectConnection,
    authScopes: {
      loggedIn: true,
    },
    args: {
      includeArchived: t.arg.boolean({ required: true, defaultValue: false }),
      projectName: t.arg.string(),
      teamId: t.arg.string({ required: true }),
      first: t.arg({
        type: "Limit",
        defaultValue: 10,
        required: true,
      }),
      after: t.arg.string(),
    },
    async resolve(_root, args, ctx) {
      await db
        .selectFrom("dstk_user.members")
        .select("dstk_user.members.id")
        .where("dstk_user.members.user_id", "=", ctx.user.id)
        .where("dstk_user.members.team_id", "=", args.teamId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
        );

      let query = db
        .selectFrom("dstk_user.projects")
        .selectAll()
        .where((eb) => {
          const statements: Expression<SqlBool>[] = [];

          statements.push(eb(
            "dstk_user.projects.team_id",
            "=",
            args.teamId,
          ));

          if (!args.includeArchived) {
            statements.push(eb(
              "dstk_user.projects.is_archived",
              "is",
              false,
            ));
          }

          if (args.projectName) {
            statements.push(eb(
              "dstk_user.projects.name",
              "ilike",
              `%${args.projectName}%`,
            ));
          }

          return eb.and(statements);
        });

      if (args.after) {
        const [id, dateCreated] = encoder.decode(args.after);

        query = query.where(({ eb, and, or }) =>
          or([
            eb("dstk_user.projects.date_created", ">", new Date(dateCreated)),
            and([
              eb("dstk_user.projects.date_created", "=", new Date(dateCreated)),
              eb("dstk_user.projects.id", ">", Number.parseInt(id)),
            ]),
          ]),
        );
      }

      const projects = await query
        .limit(args.first + 1)
        .orderBy("dstk_user.projects.date_created", "asc")
        .orderBy("dstk_user.projects.id", "asc")
        .execute();

      const hasNextPage = projects.length > args.first;

      const lastResult = projects[projects.length - 2];
      const continuationToken = hasNextPage
        ? encoder.encode(lastResult.id.toString(), lastResult.date_created.toISOString())
        : undefined;

      return {
        edges: projects.slice(0, args.first).map(project => ({
          cursor: continuationToken,
          node: project,
        })),
        pageInfo: {
          hasPreviousPage: !!args.after,
          hasNextPage,
          continuationToken,
        },
      };
    },
  }),
  getProject: t.field({
    type: Project,
    authScopes: {
      loggedIn: true,
    },
    args: {
      projectId: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      const project = await db
        .selectFrom("dstk_user.projects")
        .selectAll()
        .where("dstk_user.projects.project_id", "=", args.projectId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
        );

      await db
        .selectFrom("dstk_user.members")
        .select("dstk_user.members.id")
        .where("dstk_user.members.user_id", "=", ctx.user.id)
        .where("dstk_user.members.team_id", "=", project.team_id)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
        );

      return project;
    },
  }),
}));
