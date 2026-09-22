import type { Selectable } from "kysely";
import type { DstkUserUsers } from "@/db/db.js";
import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";

export type KyselyUser = Selectable<DstkUserUsers>;

export const User = builder.objectRef<KyselyUser>("User");

builder.objectType(User, {
  fields: t => ({
    userId: t.field({
      type: "ID",
      resolve(root: KyselyUser, _args, _ctx) {
        return root.id;
      },
    }),
    realName: t.exposeString("realName"),
    email: t.exposeString("email"),
    isEmailVerified: t.exposeBoolean("isEmailVerified"),
    isTwoFactorEnabled: t.exposeBoolean("isTwoFactorEnabled"),
    /* Better auth requires the account password to manage two factor auth, so
       the client needs to know when an OAuth only account cannot enroll.
    */
    hasPassword: t.field({
      type: "Boolean",
      async resolve(root: KyselyUser, _args, _ctx) {
        const account = await db
          .selectFrom("dstkUser.accounts")
          .select("dstkUser.accounts.id")
          .where("dstkUser.accounts.userId", "=", root.id)
          .where("dstkUser.accounts.providerId", "=", "credential")
          .executeTakeFirst();

        return Boolean(account);
      },
    }),
    image: t.exposeString("image"),
    userName: t.exposeString("userName"),
    dateCreated: t.field({
      type: "String",
      resolve(root: KyselyUser, _args, _ctx) {
        return root.dateCreated.toISOString();
      },
    }),
    dateModified: t.field({
      type: "String",
      resolve(root: KyselyUser, _args, _ctx) {
        return root.dateModified.toISOString();
      },
    }),
  }),
});
