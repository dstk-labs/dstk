import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";
import { Invitation } from "@/graphql/invitation/invitation.js";
import { auth } from "@/utils/auth.js";
import { RegistryOperationError } from "@/utils/errors.js";
import { createTeam } from "@/utils/teamUtils.js";
import { Team } from "./team.js";
import { UserRole } from "./teamRoles.js";

export const TeamInputType = builder.inputType("TeamInput", {
  fields: t => ({
    name: t.string({ required: true }),
    description: t.string({ required: true }),
  }),
});

export const InviteTeamMemberInputType = builder.inputType("InviteTeamMemberInput", {
  fields: t => ({
    userId: t.string({ required: true }),
    teamId: t.string({ required: true }),
    role: t.field({
      required: true,
      type: UserRole,
    }),
  }),
});

export const EditTeamInputType = builder.inputType("EditTeamInput", {
  fields: t => ({
    name: t.string({ required: true }),
    description: t.string({ required: true }),
    teamId: t.string({ required: true }),
  }),
});

builder.mutationFields(t => ({
  createTeam: t.field({
    type: Team,
    authScopes: {
      loggedIn: true,
    },
    args: {
      data: t.arg({ type: TeamInputType, required: true }),
    },
    async resolve(_root, args, ctx) {
      const team = await createTeam({
        description: args.data.description,
        name: args.data.name,
        userId: ctx.user.id,
      });

      return team;
    },
  }),
  archiveTeam: t.field({
    type: Team,
    authScopes: {
      loggedIn: true,
    },
    args: {
      teamId: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      const results = await db.transaction().execute(async (trx) => {
        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              dstkTeam: ["archive"],
            },
            organizationId: args.teamId,
          },
        });

        if (!success) {
          throw new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" });
        }

        const team = await trx
          .selectFrom("dstkUser.teams")
          .select(["dstkUser.teams.isArchived"])
          .where("dstkUser.teams.id", "=", args.teamId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" }),
          );

        const result = await trx
          .updateTable("dstkUser.teams")
          .set({
            modifiedById: ctx.user.id,
            dateModified: new Date(),
            isArchived: !team.isArchived,
          })
          .where("dstkUser.teams.id", "=", args.teamId)
          .returningAll()
          .executeTakeFirstOrThrow();

        return result;
      });
      return results;
    },
  }),
  editTeam: t.field({
    type: Team,
    authScopes: {
      loggedIn: true,
    },
    args: {
      data: t.arg({ type: EditTeamInputType, required: true }),
    },
    async resolve(_root, args, ctx) {
      const results = await db.transaction().execute(async (trx) => {
        const { success } = await auth.api.hasPermission({
          headers: ctx.headers,
          body: {
            permissions: {
              dstkTeam: ["edit"],
            },
            organizationId: args.data.teamId,
          },
        });

        if (!success) {
          throw new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" });
        }

        const team = await trx
          .selectFrom("dstkUser.teams")
          .select(["dstkUser.teams.id", "dstkUser.teams.isArchived"])
          .where("dstkUser.teams.id", "=", args.data.teamId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" }),
          );

        if (team.isArchived) {
          throw new RegistryOperationError({ name: "ARCHIVED_TEAM_ERROR" });
        }

        const result = await trx
          .updateTable("dstkUser.teams")
          .set({
            description: args.data.description,
            name: args.data.name,
            modifiedById: ctx.user.id,
            dateModified: new Date(),
          })
          .where("dstkUser.teams.id", "=", args.data.teamId)
          .returningAll()
          .executeTakeFirstOrThrow();

        return result;
      });

      return results;
    },
  }),
  inviteToTeam: t.field({
    type: Invitation,
    authScopes: {
      loggedIn: true,
    },
    args: {
      data: t.arg({ type: InviteTeamMemberInputType, required: true }),
    },
    async resolve(_root, args, ctx) {
      const { success } = await auth.api.hasPermission({
        headers: ctx.headers,
        body: {
          permissions: {
            dstkTeam: ["invite"],
          },
          organizationId: args.data.teamId,
        },
      });

      if (!success) {
        throw new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" });
      }

      const user = await db
        .selectFrom("dstkUser.users")
        .select("dstkUser.users.email")
        .where("dstkUser.users.id", "=", args.data.userId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" }),
        );

      await auth.api.createInvitation({
        headers: ctx.headers,
        body: {
          email: user.email,
          role: args.data.role,
          organizationId: args.data.teamId,
        },
      });

      return db
        .selectFrom("dstkUser.invitations")
        .selectAll()
        .where("dstkUser.invitations.email", "=", user.email)
        .where("dstkUser.invitations.teamId", "=", args.data.teamId)
        .orderBy("dstkUser.invitations.dateCreated", "desc")
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" }),
        );
    },
  }),
  cancelInvitation: t.field({
    type: Invitation,
    authScopes: {
      loggedIn: true,
    },
    args: {
      invitationId: t.arg.string({ required: true }),
      teamId: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      const { success } = await auth.api.hasPermission({
        headers: ctx.headers,
        body: {
          permissions: {
            dstkTeam: ["cancelInvite"],
          },
          organizationId: args.teamId,
        },
      });

      if (!success) {
        throw new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" });
      }

      await auth.api.cancelInvitation({
        headers: ctx.headers,
        body: {
          invitationId: args.invitationId,
        },
      });

      return db
        .selectFrom("dstkUser.invitations")
        .selectAll()
        .where("dstkUser.invitations.id", "=", args.invitationId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" }),
        );
    },
  }),
}));
