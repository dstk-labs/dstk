import type { Selectable } from "kysely";
import type { DstkUserApiKey } from "../../db/db.js";
import { builder } from "../../builder.js";
import { db } from "../../db/kysely.js";
import { User } from "../user/user.js";

export type KyselyApiKey = Selectable<DstkUserApiKey>;

export const ApiKey = builder.objectRef<KyselyApiKey>("ApiKey");

builder.objectType(ApiKey, {
  fields: t => ({
    apiKeyId: t.field({
      type: "ID",
      resolve(root: KyselyApiKey, _args, _ctx) {
        return root.api_key_id;
      },
    }),
    userId: t.field({
      type: User,
      async resolve(root: KyselyApiKey, _args, _ctx) {
        const result = await db
          .selectFrom("dstk_user.user")
          .selectAll()
          .where("dstk_user.user.user_id", "=", root.user_id)
          .executeTakeFirstOrThrow();

        return result;
      },
    }),
    apiKey: t.exposeString("api_key"),
    isArchived: t.exposeBoolean("is_archived"),
    dateCreated: t.field({
      type: "String",
      resolve(root: KyselyApiKey, _args, _ctx) {
        return root.date_created.toISOString();
      },
    }),
  }),
});
