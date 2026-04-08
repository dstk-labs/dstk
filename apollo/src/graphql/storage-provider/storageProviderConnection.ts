import type { PageInfoClass } from "../misc/pageInfo.js";
import type { StorageProviderEdgeClass } from "./storageProviderEdge.js";
import { builder } from "../../builder.js";
import { PageInfo } from "../misc/pageInfo.js";
import { StorageProviderEdge } from "./storageProviderEdge.js";

export const StorageProviderConnection = builder.objectRef<StorageProviderConnectionClass>("StorageProviderConnection");

builder.objectType(StorageProviderConnection, {
  fields: t => ({
    edges: t.field({
      type: [StorageProviderEdge],
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

export class StorageProviderConnectionClass {
  edges!: StorageProviderEdgeClass[];
  pageInfo!: PageInfoClass;
}
