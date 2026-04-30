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
        return root.apiKeyId;
      },
    }),
    userId: t.field({
      type: User,
      async resolve(root: KyselyApiKey, _args, _ctx) {
        const result = await db
          .selectFrom("dstkUser.users")
          .selectAll()
          .where("dstkUser.users.id", "=", root.userId)
          .executeTakeFirstOrThrow();

        return result;
      },
    }),
    apiKey: t.exposeString("apiKey"),
    isArchived: t.exposeBoolean("isArchived"),
    dateCreated: t.field({
      type: "String",
      resolve(root: KyselyApiKey, _args, _ctx) {
        return root.dateCreated.toISOString();
      },
    }),
  }),
});
