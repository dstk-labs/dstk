import type { KyselyMLModelVersion } from "./modelVersion.js";
import { builder } from "../../builder.js";
import { MLModelVersion } from "./modelVersion.js";

export const MLModelVersionEdge = builder.objectRef<MLModelVersionEdgeClass>("MLModelVersionEdge");

builder.objectType(MLModelVersionEdge, {
  fields: t => ({
    cursor: t.exposeString("cursor", { nullable: true }),
    node: t.field({
      type: MLModelVersion,
      async resolve(root, _args, _ctx) {
        return root.node;
      },
    }),
  }),
});

export class MLModelVersionEdgeClass {
  cursor?: string;
  node!: KyselyMLModelVersion;
}
