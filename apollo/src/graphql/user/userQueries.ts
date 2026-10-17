import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";
import { ApiKey } from "@/graphql/auth/auth.js";
import { queryNamespace } from "@/graphql/misc/namespace.js";
import { EMPTY_PAGE, paginate } from "@/graphql/misc/pagination.js";
import { AccountError } from "@/utils/errors.js";
import { User } from "./user.js";
import { UserConnection } from "./userConnection.js";

const ApiKeyQuery = queryNamespace("apiKey", "ApiKeyQuery");

builder.objectFields(ApiKeyQuery, t => ({
  list: t.field({
    type: [ApiKey],
    authScopes: {
      loggedIn: true,
    },
    async resolve(_root, _args, ctx) {
      const apiKeys = await db
        .selectFrom("dstkUser.apiKeys")
        .selectAll()
        .where(({ eb, and }) =>
          and([
            eb("dstkUser.apiKeys.userId", "=", ctx.user.id),
            eb("dstkUser.apiKeys.isEnabled", "=", true),
          ]),
        )
        .execute();

      return apiKeys;
    },
  }),
}));

const UserQuery = queryNamespace("user", "UserQuery");

builder.objectFields(UserQuery, t => ({
  list: t.field({
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

      if (userTeams.length === 0) {
        return EMPTY_PAGE;
      }

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

      return paginate(query, ["dstkUser.users.dateCreated", "dstkUser.users.id"], args);
    },
  }),
  get: t.field({
    type: User,
    authScopes: {
      loggedIn: true,
    },
    // Anonymous callers get null instead of a GraphQL error so the web root
    // loader can render the logged-out state without treating it as a failure.
    unauthorizedResolver: () => null,
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
