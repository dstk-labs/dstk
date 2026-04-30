import type { Selectable } from "kysely";
import type { DstkUserUsers } from "../../db/db.js";
import { builder } from "../../builder.js";

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
