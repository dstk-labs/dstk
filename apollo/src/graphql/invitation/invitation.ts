import type { Selectable } from "kysely";
import type { DstkUserInvitations } from "../../db/db.js";
import { builder } from "../../builder.js";
import { db } from "../../db/kysely.js";
import { RegistryOperationError } from "../../utils/errors.js";
import { User } from "../user/user.js";

export type KyselyInvitation = Selectable<DstkUserInvitations>;

export const Invitation = builder.objectRef<KyselyInvitation>("Invitation");

builder.objectType(Invitation, {
  fields: t => ({
    id: t.field({
      type: "ID",
      resolve(root) {
        return root.id;
      },
    }),
    email: t.exposeString("email"),
    inviter: t.field({
      type: User,
      async resolve(root) {
        return db
          .selectFrom("dstk_user.users")
          .selectAll()
          .where("dstk_user.users.id", "=", root.inviter_id)
          .executeTakeFirstOrThrow(
            () => new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" }),
          );
      },
    }),
    teamId: t.exposeString("team_id"),
    role: t.exposeString("role"),
    status: t.exposeString("status", { nullable: true }),
    expiresAt: t.field({
      type: "String",
      resolve(root) {
        return root.expires_at.toISOString();
      },
    }),
    dateCreated: t.field({
      type: "String",
      resolve(root) {
        return root.date_created.toISOString();
      },
    }),
    dateModified: t.field({
      type: "String",
      resolve(root) {
        return root.date_modified.toISOString();
      },
    }),
  }),
});
