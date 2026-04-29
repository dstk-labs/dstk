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
    realName: t.exposeString("real_name"),
    email: t.exposeString("email"),
    isEmailVerified: t.exposeBoolean("is_email_verified"),
    isTwoFactorEnabled: t.exposeBoolean("is_two_factor_enabled"),
    image: t.exposeString("image"),
    userName: t.exposeString("user_name"),
    dateCreated: t.field({
      type: "String",
      resolve(root: KyselyUser, _args, _ctx) {
        return root.date_created.toISOString();
      },
    }),
    dateModified: t.field({
      type: "String",
      resolve(root: KyselyUser, _args, _ctx) {
        return root.date_modified.toISOString();
      },
    }),
  }),
});
