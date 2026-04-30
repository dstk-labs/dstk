import type { MLModelVersionEdgeClass } from "./modelVersionEdge.js";
import type { PageInfoClass } from "@/graphql/misc/pageInfo.js";
import { builder } from "@/builder.js";
import { PageInfo } from "@/graphql/misc/pageInfo.js";
import { MLModelVersionEdge } from "./modelVersionEdge.js";

export const MLModelVersionConnection = builder.objectRef<MLModelVersionConnectionClass>(
  "MLModelVersionConnection",
);

builder.objectType(MLModelVersionConnection, {
  fields: t => ({
    edges: t.field({
      type: [MLModelVersionEdge],
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

export class MLModelVersionConnectionClass {
  edges!: MLModelVersionEdgeClass[];
  pageInfo!: PageInfoClass;
}
