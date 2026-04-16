import type { PageInfoClass } from "../misc/pageInfo.js";
import type { ProjectEdgeClass } from "./projectEdge.js";
import { builder } from "../../builder.js";
import { PageInfo } from "../misc/pageInfo.js";
import { ProjectEdge } from "./projectEdge.js";

export const ProjectConnection = builder.objectRef<ProjectConnectionClass>("ProjectConnection");

builder.objectType(ProjectConnection, {
  fields: t => ({
    edges: t.field({
      type: [ProjectEdge],
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

export class ProjectConnectionClass {
  edges!: ProjectEdgeClass[];
  pageInfo!: PageInfoClass;
}
