import type { Selectable } from "kysely";
import type { DstkMetadataEdgeRelations } from "../../db/db.js";
import { builder } from "../../builder.js";

export type KyselyEdgeRelations = Selectable<DstkMetadataEdgeRelations>;

export const Role = builder.objectRef<KyselyEdgeRelations>("Role");

builder.objectType(Role, {
  fields: t => ({
    name: t.exposeString("type"),
    description: t.exposeString("description"),
  }),
});
