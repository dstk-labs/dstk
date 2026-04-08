import type { KyselyStorageProvider } from "./storageProvider.js";
import { builder } from "../../builder.js";
import { StorageProvider } from "./storageProvider.js";

export const StorageProviderEdge = builder.objectRef<StorageProviderEdgeClass>("StorageProviderEdge");

builder.objectType(StorageProviderEdge, {
  fields: t => ({
    cursor: t.exposeString("cursor", { nullable: true }),
    node: t.field({
      type: StorageProvider,
      async resolve(root, _args, _ctx) {
        return root.node;
      },
    }),
  }),
});

export class StorageProviderEdgeClass {
  cursor?: string;
  node!: KyselyStorageProvider;
}
