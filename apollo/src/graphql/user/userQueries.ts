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
        .selectFrom("dstkUser.apiKey")
        .selectAll()
        .where(({ eb, and }) =>
          and([
            eb("dstkUser.apiKey.userId", "=", ctx.user.id),
            eb("dstkUser.apiKey.isArchived", "=", false),
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
        .selectFrom("dstkUser.members")
        .select("dstkUser.members.teamId")
        .where("dstkUser.members.userId", "=", ctx.user.id)
        .execute();

      let query = db
        .selectFrom("dstkUser.users")
        .selectAll()
        .where(
          "dstkUser.users.id",
          "in",
          db.selectFrom("dstkUser.members")
            .select("dstkUser.members.userId")
            .where("dstkUser.members.teamId", "in", userTeams.map(t => t.teamId)),
        );

      if (args.userName) {
        query = query.where(
          "dstkUser.users.userName",
          "ilike",
          `%${args.userName}%`,
        );
      }

      if (args.after) {
        const [id, dateCreated] = encoder.decode(args.after);

        query = query.where(({ eb, and, or }) =>
          or([
            eb("dstkUser.users.dateCreated", ">", new Date(dateCreated)),
            and([
              eb("dstkUser.users.dateCreated", "=", new Date(dateCreated)),
              eb("dstkUser.users.id", ">", id),
            ]),
          ]),
        );
      }

      const users = await query
        .limit(args.first + 1)
        .orderBy("dstkUser.users.dateCreated", "asc")
        .orderBy("dstkUser.users.id", "asc")
        .execute();

      const hasNextPage = users.length > args.first;

      const lastResult = users[users.length - 2];
      const continuationToken = hasNextPage
        ? encoder.encode(lastResult.id, lastResult.dateCreated.toISOString())
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
        .selectFrom("dstkUser.users")
        .selectAll()
        .where("dstkUser.users.id", "=", ctx.user.id)
        .executeTakeFirstOrThrow(
          () => new AccountError({ name: "INVALID_SESSION_ERROR" }),
        );
    },
  }),
}));
