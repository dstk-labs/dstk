import { builder } from "../../builder.js";
import { db } from "../../db/kysely.js";
import { auth } from "../../utils/auth.js";
import { RegistryOperationError } from "../../utils/errors.js";
import { Project } from "./project.js";

export const ProjectInputType = builder.inputType("ProjectInput", {
  fields: t => ({
    name: t.string({ required: true }),
    description: t.string({ required: true }),
    teamId: t.string({ required: true }),
  }),
});

export const EditProjectInputType = builder.inputType("EditProjectInput", {
  fields: t => ({
    name: t.string({ required: true }),
    description: t.string({ required: true }),
    projectId: t.string({ required: true }),
  }),
});

builder.mutationFields(t => ({
  createProject: t.field({
    type: Project,
    authScopes: {
      loggedIn: true,
    },
    args: {
      data: t.arg({ type: ProjectInputType, required: true }),
    },
    async resolve(_root, args, ctx) {
      const results = await db.transaction().execute(async (trx) => {
        const team = await trx
          .selectFrom("dstk_user.teams")
          .select("dstk_user.teams.is_archived")
          .where("dstk_user.teams.id", "=", args.data.teamId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" }),
          );

        if (team.is_archived) {
          throw new RegistryOperationError({ name: "ARCHIVED_TEAM_ERROR" });
        }

        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              project: ["create"],
            },
            organizationId: args.data.teamId,
          },
        });

        if (!success) {
          throw new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" });
        }

        const project = await trx
          .insertInto("dstk_user.projects")
          .values({
            name: args.data.name,
            description: args.data.description,
            created_by_id: ctx.user.id,
            modified_by_id: ctx.user.id,
            team_id: args.data.teamId,
          })
          .returningAll()
          .executeTakeFirstOrThrow();

        return project;
      });
      return results;
    },
  }),
  archiveProject: t.field({
    type: Project,
    authScopes: {
      loggedIn: true,
    },
    args: {
      projectId: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      const results = await db.transaction().execute(async (trx) => {
        const project = await trx
          .selectFrom("dstk_user.projects")
          .select(["dstk_user.projects.team_id", "dstk_user.projects.is_archived"])
          .where("dstk_user.projects.project_id", "=", args.projectId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
          );

        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              project: ["archive"],
            },
            organizationId: project.team_id,
          },
        });

        if (!success) {
          throw new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" });
        }

        const result = await trx
          .updateTable("dstk_user.projects")
          .set({
            modified_by_id: ctx.user.id,
            date_modified: new Date(),
            is_archived: !project.is_archived,
          })
          .where("dstk_user.projects.project_id", "=", args.projectId)
          .returningAll()
          .executeTakeFirstOrThrow();

        return result;
      });
      return results;
    },
  }),
  editProject: t.field({
    type: Project,
    authScopes: {
      loggedIn: true,
    },
    args: {
      data: t.arg({ type: EditProjectInputType, required: true }),
    },
    async resolve(_root, args, ctx) {
      const results = await db.transaction().execute(async (trx) => {
        const project = await trx
          .selectFrom("dstk_user.projects")
          .select(["dstk_user.projects.team_id", "dstk_user.projects.is_archived"])
          .where("dstk_user.projects.project_id", "=", args.data.projectId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
          );

        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              project: ["edit"],
            },
            organizationId: project.team_id,
          },
        });

        if (!success) {
          throw new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" });
        }

        if (project.is_archived) {
          throw new RegistryOperationError({ name: "ARCHIVED_PROJECT_ERROR" });
        }

        const result = await trx
          .updateTable("dstk_user.projects")
          .set({
            description: args.data.description,
            name: args.data.name,
            modified_by_id: ctx.user.id,
            date_modified: new Date(),
          })
          .where("dstk_user.projects.project_id", "=", args.data.projectId)
          .returningAll()
          .executeTakeFirstOrThrow();

        return result;
      });
      return results;
    },
  }),
}));
