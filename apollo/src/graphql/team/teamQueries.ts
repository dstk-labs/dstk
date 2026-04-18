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
        .selectFrom("dstk_user.members")
        .select("dstk_user.members.team_id")
        .where((eb) => {
          const statements: Expression<SqlBool>[] = [];

          statements.push(eb("dstk_user.members.user_id", "=", ctx.user.id));

          if (args.teamId) {
            statements.push(eb("dstk_user.members.team_id", "=", args.teamId));
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
        .selectFrom("dstk_user.teams")
        .selectAll()
        .where((eb) => {
          const statements: Expression<SqlBool>[] = [];

          statements.push(eb(
            "dstk_user.teams.id",
            "in",
            userMemberships.map(m => m.team_id),
          ));

          if (!args.includeArchived) {
            statements.push(eb(
              "dstk_user.teams.is_archived",
              "is",
              false,
            ));
          }

          if (args.teamName) {
            statements.push(eb(
              "dstk_user.teams.name",
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
            eb("dstk_user.teams.date_created", ">", new Date(dateCreated)),
            and([
              eb("dstk_user.teams.date_created", "=", new Date(dateCreated)),
              eb("dstk_user.teams.id", ">", id),
            ]),
          ]),
        );
      }

      const teams = await query
        .limit(args.first + 1)
        .orderBy("dstk_user.teams.date_created", "asc")
        .orderBy("dstk_user.teams.id", "asc")
        .execute();

      const hasNextPage = teams.length > args.first;

      const lastResult = teams[teams.length - 2];
      const continuationToken = hasNextPage
        ? encoder.encode(lastResult.id, lastResult.date_created.toISOString())
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
        .selectFrom("dstk_user.members")
        .select("dstk_user.members.id")
        .where("dstk_user.members.user_id", "=", ctx.user.id)
        .where("dstk_user.members.team_id", "=", args.teamId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" }),
        );

      let query = db
        .selectFrom("dstk_user.invitations")
        .selectAll()
        .where("dstk_user.invitations.team_id", "=", args.teamId);

      if (args.status) {
        query = query.where("dstk_user.invitations.status", "=", args.status);
      }

      if (args.after) {
        const [id, dateCreated] = encoder.decode(args.after);

        query = query.where(({ eb, and, or }) =>
          or([
            eb("dstk_user.invitations.date_created", ">", new Date(dateCreated)),
            and([
              eb("dstk_user.invitations.date_created", "=", new Date(dateCreated)),
              eb("dstk_user.invitations.id", ">", id),
            ]),
          ]),
        );
      }

      const invitations = await query
        .limit(args.first + 1)
        .orderBy("dstk_user.invitations.date_created", "asc")
        .orderBy("dstk_user.invitations.id", "asc")
        .execute();

      const hasNextPage = invitations.length > args.first;

      const lastResult = invitations[invitations.length - 2];
      const continuationToken = hasNextPage
        ? encoder.encode(lastResult.id, lastResult.date_created.toISOString())
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
        .selectFrom("dstk_user.members")
        .select("dstk_user.members.id")
        .where("dstk_user.members.user_id", "=", ctx.user.id)
        .where("dstk_user.members.team_id", "=", args.teamId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" }),
        );

      const memberUserIds = await db
        .selectFrom("dstk_user.members")
        .select("dstk_user.members.user_id")
        .where("dstk_user.members.team_id", "=", args.teamId)
        .execute();

      return db
        .selectFrom("dstk_user.users")
        .selectAll()
        .where("dstk_user.users.id", "in", memberUserIds.map(m => m.user_id))
        .execute();
    },
  }),
}));
