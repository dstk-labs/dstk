import { builder } from "../../builder.js";
import { db } from "../../db/kysely.js";
import { Encoder } from "../../utils/encoder.js";
import { AccountError } from "../../utils/errors.js";
import { ApiKey } from "../auth/auth.js";
import { User } from "./user.js";
import { UserConnection } from "./userConnection.js";

const encoder = new Encoder();

builder.queryFields(t => ({
  listApiKeys: t.field({
    type: [ApiKey],
    authScopes: {
      loggedIn: true,
    },
    async resolve(_root, _args, ctx) {
      const apiKeys = await db
        .selectFrom("dstk_user.api_key")
        .selectAll()
        .where(({ eb, and }) =>
          and([
            eb("dstk_user.api_key.user_id", "=", ctx.user.id),
            eb("dstk_user.api_key.is_archived", "=", false),
          ]),
        )
        .execute();

      return apiKeys;
    },
  }),
  listUsers: t.field({
    type: UserConnection,
    authScopes: {
      loggedIn: true,
    },
    args: {
      first: t.arg({
        type: "Limit",
        defaultValue: 10,
        required: true,
      }),
      after: t.arg.string(),
      userName: t.arg.string(),
    },
    async resolve(_root, args, ctx) {
      const userTeams = await db
        .selectFrom("dstk_user.members")
        .select("dstk_user.members.team_id")
        .where("dstk_user.members.user_id", "=", ctx.user.id)
        .execute();

      let query = db
        .selectFrom("dstk_user.users")
        .selectAll()
        .where(
          "dstk_user.users.id",
          "in",
          db.selectFrom("dstk_user.members")
            .select("dstk_user.members.user_id")
            .where("dstk_user.members.team_id", "in", userTeams.map(t => t.team_id)),
        );

      if (args.userName) {
        query = query.where(
          "dstk_user.users.user_name",
          "ilike",
          `%${args.userName}%`,
        );
      }

      if (args.after) {
        const [id, dateCreated] = encoder.decode(args.after);

        query = query.where(({ eb, and, or }) =>
          or([
            eb("dstk_user.users.date_created", ">", new Date(dateCreated)),
            and([
              eb("dstk_user.users.date_created", "=", new Date(dateCreated)),
              eb("dstk_user.users.id", ">", id),
            ]),
          ]),
        );
      }

      const users = await query
        .limit(args.first + 1)
        .orderBy("dstk_user.users.date_created", "asc")
        .orderBy("dstk_user.users.id", "asc")
        .execute();

      const hasNextPage = users.length > args.first;

      const lastResult = users[users.length - 2];
      const continuationToken = hasNextPage
        ? encoder.encode(lastResult.id, lastResult.date_created.toISOString())
        : undefined;

      return {
        edges: users.slice(0, args.first).map(user => ({
          cursor: continuationToken,
          node: user,
        })),
        pageInfo: {
          hasPreviousPage: !!args.after,
          hasNextPage,
          continuationToken,
        },
      };
    },
  }),
  getUser: t.field({
    type: User,
    authScopes: {
      loggedIn: true,
    },
    async resolve(_root, _args, ctx) {
      return db
        .selectFrom("dstk_user.users")
        .selectAll()
        .where("dstk_user.users.id", "=", ctx.user.id)
        .executeTakeFirstOrThrow(
          () => new AccountError({ name: "INVALID_SESSION_ERROR" }),
        );
    },
  }),
}));
