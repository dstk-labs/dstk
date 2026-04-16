import type { KyselyProject } from "./project.js";
import { builder } from "../../builder.js";
import { Project } from "./project.js";

export const ProjectEdge = builder.objectRef<ProjectEdgeClass>("ProjectEdge");

builder.objectType(ProjectEdge, {
  fields: t => ({
    cursor: t.exposeString("cursor", { nullable: true }),
    node: t.field({
      type: Project,
      async resolve(root, _args, _ctx) {
        return root.node;
      },
    }),
  }),
});

export class ProjectEdgeClass {
  cursor?: string;
  node!: KyselyProject;
}
