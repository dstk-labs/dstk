import type { KyselyMLModel } from "./model.js";
import { builder } from "../../builder.js";
import { MLModel } from "./model.js";

export const MLModelEdge = builder.objectRef<MLModelEdgeClass>("MLModelEdge");

builder.objectType(MLModelEdge, {
  fields: t => ({
    cursor: t.exposeString("cursor", { nullable: true }),
    node: t.field({
      type: MLModel,
      async resolve(root, _args, _ctx) {
        return root.node;
      },
    }),
  }),
});

export class MLModelEdgeClass {
  cursor?: string;
  node!: KyselyMLModel;
}
