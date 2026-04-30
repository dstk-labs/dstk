import type { TeamEdgeClass } from "./teamEdge.js";
import type { PageInfoClass } from "@/graphql/misc/pageInfo.js";
import { builder } from "@/builder.js";
import { PageInfo } from "@/graphql/misc/pageInfo.js";
import { TeamEdge } from "./teamEdge.js";

export const TeamConnection = builder.objectRef<TeamConnectionClass>("TeamConnection");

builder.objectType(TeamConnection, {
  fields: t => ({
    edges: t.field({
      type: [TeamEdge],
      resolve(root, _args, _ctx) {
        return root.edges;
      },
    }),
    pageInfo: t.field({
      type: PageInfo,
      resolve(root, _args, _ctx) {
        return root.pageInfo;
      },
    }),
  }),
});

export class TeamConnectionClass {
  edges!: TeamEdgeClass[];
  pageInfo!: PageInfoClass;
}
