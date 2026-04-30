import type { Expression, SqlBool } from "kysely";
import { builder } from "../../builder.js";
import { db } from "../../db/kysely.js";
import { Encoder } from "../../utils/encoder.js";
import { RegistryOperationError } from "../../utils/errors.js";
import { InvitationConnection } from "../invitation/invitationConnection.js";
import { User } from "../user/user.js";
import { TeamConnection } from "./teamConnection.js";

const encoder = new Encoder();

builder.queryFields(t => ({
  listTeams: t.field({
    type: TeamConnection,
    authScopes: {
      loggedIn: true,
    },
    args: {
      includeArchived: t.arg.boolean({ required: true, defaultValue: false }),
      teamName: t.arg.string(),
      teamId: t.arg.string(),
      first: t.arg({
        type: "Limit",
        defaultValue: 10,
        required: true,
      }),
      after: t.arg.string(),
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
        return {
          edges: [],
          pageInfo: { hasPreviousPage: false, hasNextPage: false, continuationToken: undefined },
        };
      }

      let query = db
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

      if (args.after) {
        const [id, dateCreated] = encoder.decode(args.after);

        query = query.where(({ eb, and, or }) =>
          or([
            eb("dstkUser.teams.dateCreated", ">", new Date(dateCreated)),
            and([
              eb("dstkUser.teams.dateCreated", "=", new Date(dateCreated)),
              eb("dstkUser.teams.id", ">", id),
            ]),
          ]),
        );
      }

      const teams = await query
        .limit(args.first + 1)
        .orderBy("dstkUser.teams.dateCreated", "asc")
        .orderBy("dstkUser.teams.id", "asc")
        .execute();

      const hasNextPage = teams.length > args.first;

      const lastResult = teams[teams.length - 2];
      const continuationToken = hasNextPage
        ? encoder.encode(lastResult.id, lastResult.dateCreated.toISOString())
        : undefined;

      return {
        edges: teams.slice(0, args.first).map(team => ({
          cursor: continuationToken,
          node: team,
        })),
        pageInfo: {
          hasPreviousPage: !!args.after,
          hasNextPage,
          continuationToken,
        },
      };
    },
  }),
  listInvitations: t.field({
    type: InvitationConnection,
    authScopes: {
      loggedIn: true,
    },
    args: {
      teamId: t.arg.string({ required: true }),
      status: t.arg.string(),
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
          () => new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" }),
        );

      let query = db
        .selectFrom("dstkUser.invitations")
        .selectAll()
        .where("dstkUser.invitations.teamId", "=", args.teamId);

      if (args.status) {
        query = query.where("dstkUser.invitations.status", "=", args.status);
      }

      if (args.after) {
        const [id, dateCreated] = encoder.decode(args.after);

        query = query.where(({ eb, and, or }) =>
          or([
            eb("dstkUser.invitations.dateCreated", ">", new Date(dateCreated)),
            and([
              eb("dstkUser.invitations.dateCreated", "=", new Date(dateCreated)),
              eb("dstkUser.invitations.id", ">", id),
            ]),
          ]),
        );
      }

      const invitations = await query
        .limit(args.first + 1)
        .orderBy("dstkUser.invitations.dateCreated", "asc")
        .orderBy("dstkUser.invitations.id", "asc")
        .execute();

      const hasNextPage = invitations.length > args.first;

      const lastResult = invitations[invitations.length - 2];
      const continuationToken = hasNextPage
        ? encoder.encode(lastResult.id, lastResult.dateCreated.toISOString())
        : undefined;

      return {
        edges: invitations.slice(0, args.first).map(invitation => ({
          cursor: continuationToken,
          node: invitation,
        })),
        pageInfo: {
          hasPreviousPage: !!args.after,
          hasNextPage,
          continuationToken,
        },
      };
    },
  }),
  listTeamMembers: t.field({
    type: [User],
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

      const memberUserIds = await db
        .selectFrom("dstkUser.members")
        .select("dstkUser.members.userId")
        .where("dstkUser.members.teamId", "=", args.teamId)
        .execute();

      return db
        .selectFrom("dstkUser.users")
        .selectAll()
        .where("dstkUser.users.id", "in", memberUserIds.map(m => m.userId))
        .execute();
    },
  }),
}));
