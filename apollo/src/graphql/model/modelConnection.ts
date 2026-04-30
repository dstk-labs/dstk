import type { MLModelEdgeClass } from "./modelEdge.js";
import type { PageInfoClass } from "@/graphql/misc/pageInfo.js";
import { builder } from "@/builder.js";
import { PageInfo } from "@/graphql/misc/pageInfo.js";
import { MLModelEdge } from "./modelEdge.js";

export const MLModelConnection = builder.objectRef<MLModelConnectionClass>("MLModelConnection");

builder.objectType(MLModelConnection, {
  fields: t => ({
    edges: t.field({
      type: [MLModelEdge],
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

export class MLModelConnectionClass {
  edges!: MLModelEdgeClass[];
  pageInfo!: PageInfoClass;
}
