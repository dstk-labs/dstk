import type { Expression, SqlBool } from "kysely";
import { builder } from "../../builder.js";
import { db } from "../../db/kysely.js";
import { userHasRole } from "../../utils/rls.js";
import { Team } from "./team.js";
import { User } from "./user.js";

builder.queryFields(t => ({
  listTeams: t.field({
    type: [Team],
    authScopes: {
      loggedIn: true,
    },
    args: {
      includeArchived: t.arg.boolean({ required: true, defaultValue: false }),
      teamName: t.arg.string(),
      teamId: t.arg.string(),
    },
    async resolve(_root, args, ctx) {
      const userTeamEdges = await db
        .selectFrom("dstk_user.team_edges")
        .select("dstk_user.team_edges.team_id")
        .where(({ eb }) => {
          const ands: Expression<SqlBool>[] = [];

          ands.push(eb("dstk_user.team_edges.user_id", "=", ctx.user.user_id));

          if (args.teamId) {
            ands.push(eb("dstk_user.team_edges.team_id", "=", args.teamId));
          }

          return eb.and(ands);
        })
        .execute();

      if (userTeamEdges.length === 0) {
        return [];
      }

      const userTeams = await db
        .selectFrom("dstk_user.teams")
        .selectAll()
        .where((eb) => {
          const statements: Expression<SqlBool>[] = [];

          statements.push(eb(
            "dstk_user.teams.team_id",
            "in",
            userTeamEdges.map(edge => edge.team_id),
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
        })
        .execute();

      return userTeams;
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
      await userHasRole({
        userId: ctx.user.user_id,
        teamId: args.teamId,
        roles: ["owner", "member", "viewer"],
      });

      const teamMembers = await db
        .selectFrom("dstk_user.user")
        .selectAll()
        .leftJoin(
          "dstk_user.team_edges",
          "dstk_user.user.user_id",
          "dstk_user.team_edges.user_id",
        )
        .where("dstk_user.team_edges.team_id", "=", args.teamId)
        .execute();

      return teamMembers;
    },
  }),
}));
