import type { Expression, SqlBool } from "kysely";
import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";
import { InvitationQuery } from "@/graphql/invitation/invitation.js";
import { InvitationConnection } from "@/graphql/invitation/invitationConnection.js";
import { queryNamespace } from "@/graphql/misc/namespace.js";
import { EMPTY_PAGE, pageArgs, paginate } from "@/graphql/misc/pagination.js";
import { RegistryOperationError } from "@/utils/errors.js";
import { TeamConnection } from "./teamConnection.js";
import { TeamMember } from "./teamMember.js";

const TeamQuery = queryNamespace("team", "TeamQuery");

builder.objectFields(TeamQuery, t => ({
  list: t.field({
    type: TeamConnection,
    authScopes: {
      loggedIn: true,
    },
    args: {
      includeArchived: t.arg.boolean({ required: true, defaultValue: false }),
      teamName: t.arg.string(),
      teamId: t.arg.string(),
      ...pageArgs,
    },
    async resolve(_root, args, ctx) {
      const userMemberships = await db
        .selectFrom("dstkUser.members")
        .select("dstkUser.members.teamId")
        .where((eb) => {
          const statements: Expression<SqlBool>[] = [];

          statements.push(eb("dstkUser.members.userId", "=", ctx.user.id));

          if (args.teamId) {
            statements.push(eb("dstkUser.members.teamId", "=", args.teamId));
          }

          return eb.and(statements);
        })
        .execute();

      if (userMemberships.length === 0) {
        return EMPTY_PAGE;
      }

      const query = db
        .selectFrom("dstkUser.teams")
        .selectAll()
        .where((eb) => {
          const statements: Expression<SqlBool>[] = [];

          statements.push(eb(
            "dstkUser.teams.id",
            "in",
            userMemberships.map(m => m.teamId),
          ));

          if (!args.includeArchived) {
            statements.push(eb(
              "dstkUser.teams.isArchived",
              "is",
              false,
            ));
          }

          if (args.teamName) {
            statements.push(eb(
              "dstkUser.teams.name",
              "ilike",
              `%${args.teamName}%`,
            ));
          }

          return eb.and(statements);
        });

      return paginate(query, ["dstkUser.teams.dateCreated", "dstkUser.teams.id"], args);
    },
  }),
  listMembers: t.field({
    type: [TeamMember],
    authScopes: {
      loggedIn: true,
    },
    args: {
      teamId: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      await db
        .selectFrom("dstkUser.members")
        .select("dstkUser.members.id")
        .where("dstkUser.members.userId", "=", ctx.user.id)
        .where("dstkUser.members.teamId", "=", args.teamId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" }),
        );

      return db
        .selectFrom("dstkUser.members")
        .selectAll()
        .where("dstkUser.members.teamId", "=", args.teamId)
        .orderBy("dstkUser.members.dateCreated", "asc")
        .execute();
    },
  }),
}));

builder.objectFields(InvitationQuery, t => ({
  list: t.field({
    type: InvitationConnection,
    authScopes: {
      loggedIn: true,
    },
    args: {
      teamId: t.arg.string(),
      status: t.arg.string(),
      ...pageArgs,
    },
    async resolve(_root, args, ctx) {
      let query = db
        .selectFrom("dstkUser.invitations")
        .selectAll();

      if (args.teamId) {
        await db
          .selectFrom("dstkUser.members")
          .select("dstkUser.members.id")
          .where("dstkUser.members.userId", "=", ctx.user.id)
          .where("dstkUser.members.teamId", "=", args.teamId)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" }),
          );

        query = query.where("dstkUser.invitations.teamId", "=", args.teamId);
      }
      else {
        query = query.where("dstkUser.invitations.email", "=", ctx.user.email);
      }

      if (args.status) {
        query = query.where("dstkUser.invitations.status", "=", args.status);
      }

      return paginate(query, ["dstkUser.invitations.dateCreated", "dstkUser.invitations.id"], args);
    },
  }),
}));
