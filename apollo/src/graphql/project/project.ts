import type { Selectable } from "kysely";
import type { DstkUserProjects } from "@/db/db.js";
import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";
import { User } from "@/graphql/user/user.js";

export type KyselyProject = Selectable<DstkUserProjects>;

export const Project = builder.objectRef<KyselyProject>("Project");
builder.objectType(Project, {
  fields: t => ({
    projectId: t.field({
      type: "ID",
      resolve(root: KyselyProject, _args, _ctx) {
        return root.projectId;
      },
    }),
    name: t.exposeString("name"),
    description: t.exposeString("description"),
    isArchived: t.exposeBoolean("isArchived"),
    dateCreated: t.field({
      type: "String",
      resolve(root: KyselyProject, _args, _ctx) {
        return root.dateCreated.toISOString();
      },
    }),
    dateModified: t.field({
      type: "String",
      resolve(root: KyselyProject, _args, _ctx) {
        return root.dateModified.toISOString();
      },
    }),
    createdBy: t.field({
      type: User,
      async resolve(root: KyselyProject, _args, _ctx) {
        const user = await db
          .selectFrom("dstkUser.users")
          .selectAll()
          .where("dstkUser.users.id", "=", root.createdById)
          .executeTakeFirstOrThrow();
        return user;
      },
    }),
    modifiedBy: t.field({
      type: User,
      async resolve(root: KyselyProject, _args, _ctx) {
        const user = await db
          .selectFrom("dstkUser.users")
          .selectAll()
          .where("dstkUser.users.id", "=", root.modifiedById)
          .executeTakeFirstOrThrow();
        return user;
      },
    }),
  }),
});
