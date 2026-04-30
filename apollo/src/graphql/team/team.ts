import type { Selectable } from "kysely";
import type { DstkUserTeams } from "@/db/db.js";
import { builder } from "@/builder.js";

export type KyselyTeam = Selectable<DstkUserTeams>;

export const Team = builder.objectRef<KyselyTeam>("Team");

builder.objectType(Team, {
  fields: t => ({
    teamId: t.field({
      type: "ID",
      resolve(root: KyselyTeam, _args, _ctx) {
        return root.id;
      },
    }),
    dateCreated: t.field({
      type: "String",
      resolve(root: KyselyTeam, _args, _ctx) {
        return root.dateCreated.toISOString();
      },
    }),
    dateModified: t.field({
      type: "String",
      resolve(root: KyselyTeam, _args, _ctx) {
        return root.dateModified.toISOString();
      },
    }),
    description: t.exposeString("description"),
    isArchived: t.exposeBoolean("isArchived"),
    name: t.exposeString("name"),
  }),
});
