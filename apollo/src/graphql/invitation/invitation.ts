import type { Selectable } from "kysely";
import type { DstkUserInvitations } from "@/db/db.js";
import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";
import { Team } from "@/graphql/team/team.js";
import { UserRole } from "@/graphql/team/teamRoles.js";
import { User } from "@/graphql/user/user.js";

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
          .selectFrom("dstkUser.users")
          .selectAll()
          .where("dstkUser.users.id", "=", root.inviterId)
          .executeTakeFirstOrThrow();
      },
    }),
    teamId: t.field({
      type: Team,
      async resolve(root) {
        return db
          .selectFrom("dstkUser.teams")
          .selectAll()
          .where("dstkUser.teams.id", "=", root.teamId)
          .executeTakeFirstOrThrow();
      },
    }),
    role: t.field({
      type: UserRole,
      resolve(root) {
        return root.role;
      },
    }),
    status: t.exposeString("status", { nullable: true }),
    expiresAt: t.field({
      type: "String",
      resolve(root) {
        return root.expiresAt.toISOString();
      },
    }),
    dateCreated: t.field({
      type: "String",
      resolve(root) {
        return root.dateCreated.toISOString();
      },
    }),
    dateModified: t.field({
      type: "String",
      resolve(root) {
        return root.dateModified.toISOString();
      },
    }),
  }),
});
