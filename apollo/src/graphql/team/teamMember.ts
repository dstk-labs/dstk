import type { Selectable } from "kysely";
import type { DstkUserMembers } from "@/db/db.js";
import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";
import { User } from "@/graphql/user/user.js";
import { UserRole } from "./teamRoles.js";

export type KyselyTeamMember = Selectable<DstkUserMembers>;

export const TeamMember = builder.objectRef<KyselyTeamMember>("TeamMember");

builder.objectType(TeamMember, {
  fields: t => ({
    memberId: t.field({
      type: "ID",
      resolve(root) {
        return root.id;
      },
    }),
    role: t.field({
      type: UserRole,
      resolve(root) {
        return root.role;
      },
    }),
    user: t.field({
      type: User,
      async resolve(root) {
        return db
          .selectFrom("dstkUser.users")
          .selectAll()
          .where("dstkUser.users.id", "=", root.userId)
          .executeTakeFirstOrThrow();
      },
    }),
    dateCreated: t.field({
      type: "String",
      resolve(root) {
        return root.dateCreated.toISOString();
      },
    }),
  }),
});
