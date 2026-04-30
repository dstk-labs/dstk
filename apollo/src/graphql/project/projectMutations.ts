import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";
import { auth } from "@/utils/auth.js";
import { RegistryOperationError } from "@/utils/errors.js";
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
          .selectFrom("dstkUser.teams")
          .select("dstkUser.teams.isArchived")
          .where("dstkUser.teams.id", "=", args.data.teamId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" }),
          );

        if (team.isArchived) {
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
          .insertInto("dstkUser.projects")
          .values({
            name: args.data.name,
            description: args.data.description,
            createdById: ctx.user.id,
            modifiedById: ctx.user.id,
            teamId: args.data.teamId,
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
          .selectFrom("dstkUser.projects")
          .select(["dstkUser.projects.teamId", "dstkUser.projects.isArchived"])
          .where("dstkUser.projects.projectId", "=", args.projectId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
          );

        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              project: ["archive"],
            },
            organizationId: project.teamId,
          },
        });

        if (!success) {
          throw new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" });
        }

        const result = await trx
          .updateTable("dstkUser.projects")
          .set({
            modifiedById: ctx.user.id,
            dateModified: new Date(),
            isArchived: !project.isArchived,
          })
          .where("dstkUser.projects.projectId", "=", args.projectId)
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
          .selectFrom("dstkUser.projects")
          .select(["dstkUser.projects.teamId", "dstkUser.projects.isArchived"])
          .where("dstkUser.projects.projectId", "=", args.data.projectId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" }),
          );

        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              project: ["edit"],
            },
            organizationId: project.teamId,
          },
        });

        if (!success) {
          throw new RegistryOperationError({ name: "PROJECT_PERMISSION_ERROR" });
        }

        if (project.isArchived) {
          throw new RegistryOperationError({ name: "ARCHIVED_PROJECT_ERROR" });
        }

        const result = await trx
          .updateTable("dstkUser.projects")
          .set({
            description: args.data.description,
            name: args.data.name,
            modifiedById: ctx.user.id,
            dateModified: new Date(),
          })
          .where("dstkUser.projects.projectId", "=", args.data.projectId)
          .returningAll()
          .executeTakeFirstOrThrow();

        return result;
      });
      return results;
    },
  }),
}));
