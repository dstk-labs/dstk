import type { Selectable } from "kysely";
import type { DstkUserApiKeys } from "@/db/db.js";
import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";
import { User } from "@/graphql/user/user.js";

export type KyselyApiKey = Selectable<DstkUserApiKeys>;

export const ApiKey = builder.objectRef<KyselyApiKey>("ApiKey");

builder.objectType(ApiKey, {
  fields: t => ({
    apiKeyId: t.field({
      type: "ID",
      resolve(root: KyselyApiKey, _args, _ctx) {
        return root.id;
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
    name: t.exposeString("name"),
    start: t.exposeString("start"),
    isArchived: t.boolean({
      resolve(root: KyselyApiKey, _args, _ctx) {
        return !root.isEnabled;
      },
    }),
    dateCreated: t.field({
      type: "String",
      resolve(root: KyselyApiKey, _args, _ctx) {
        return root.dateCreated.toISOString();
      },
    }),
  }),
});
