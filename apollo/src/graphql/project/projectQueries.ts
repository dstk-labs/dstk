import type { Expression, SqlBool } from "kysely";
import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";
import { Encoder } from "@/utils/encoder.js";
import { RegistryOperationError } from "@/utils/errors.js";
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
        .selectFrom("dstkUser.members")
        .select("dstkUser.members.id")
        .where("dstkUser.members.userId", "=", ctx.user.id)
        .where("dstkUser.members.teamId", "=", args.teamId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
        );

      let query = db
        .selectFrom("dstkUser.projects")
        .selectAll()
        .where((eb) => {
          const statements: Expression<SqlBool>[] = [];

          statements.push(eb(
            "dstkUser.projects.teamId",
            "=",
            args.teamId,
          ));

          if (!args.includeArchived) {
            statements.push(eb(
              "dstkUser.projects.isArchived",
              "is",
              false,
            ));
          }

          if (args.projectName) {
            statements.push(eb(
              "dstkUser.projects.name",
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
            eb("dstkUser.projects.dateCreated", ">", new Date(dateCreated)),
            and([
              eb("dstkUser.projects.dateCreated", "=", new Date(dateCreated)),
              eb("dstkUser.projects.id", ">", Number.parseInt(id)),
            ]),
          ]),
        );
      }

      const projects = await query
        .limit(args.first + 1)
        .orderBy("dstkUser.projects.dateCreated", "asc")
        .orderBy("dstkUser.projects.id", "asc")
        .execute();

      const hasNextPage = projects.length > args.first;

      const lastResult = projects[projects.length - 2];
      const continuationToken = hasNextPage
        ? encoder.encode(lastResult.id.toString(), lastResult.dateCreated.toISOString())
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
        .selectFrom("dstkUser.projects")
        .selectAll()
        .where("dstkUser.projects.projectId", "=", args.projectId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
        );

      await db
        .selectFrom("dstkUser.members")
        .select("dstkUser.members.id")
        .where("dstkUser.members.userId", "=", ctx.user.id)
        .where("dstkUser.members.teamId", "=", project.teamId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
        );

      return project;
    },
  }),
}));
