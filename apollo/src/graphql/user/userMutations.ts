import { v4 as uuidv4 } from "uuid";
import { builder } from "../../builder.js";
import { db } from "../../db/kysely.js";
import { ApiKey } from "../auth/auth.js";

builder.mutationFields(t => ({
  createApiKey: t.field({
    type: ApiKey,
    authScopes: {
      loggedIn: true,
    },
    async resolve(_root, _args, ctx) {
      return await db
        .insertInto("dstk_user.api_key")
        .values({
          user_id: ctx.user.user_id,
          api_key: uuidv4().replace(/-/g, ""),
        })
        .returningAll()
        .executeTakeFirst();
    },
  }),
  archiveApiKey: t.field({
    type: ApiKey,
    authScopes: {
      loggedIn: true,
    },
    args: {
      apiKeyId: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      const results = await db.transaction().execute(async (trx) => {
        const userApiKey = await trx
          .updateTable("dstk_user.api_key")
          .set({
            is_archived: true,
          })
          .where(({ eb, and }) =>
            and([
              eb("dstk_user.api_key.api_key_id", "=", args.apiKeyId),
              eb("dstk_user.api_key.user_id", "=", ctx.user.user_id),
            ]),
          )
          .returningAll()
          .executeTakeFirstOrThrow();

        return userApiKey;
      });
      return results;
    },
  }),
}));
