import type { KyselyTeam } from "./team.js";
import { builder } from "../../builder.js";
import { Team } from "./team.js";

export const TeamEdge = builder.objectRef<TeamEdgeClass>("TeamEdge");

builder.objectType(TeamEdge, {
  fields: t => ({
    cursor: t.exposeString("cursor", { nullable: true }),
    node: t.field({
      type: Team,
      async resolve(root, _args, _ctx) {
        return root.node;
      },
    }),
  }),
});

export class TeamEdgeClass {
  cursor?: string;
  node!: KyselyTeam;
}
