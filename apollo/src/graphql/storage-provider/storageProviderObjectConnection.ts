import type { StorageProviderObjectEdgeClass } from "./storageProviderObjectEdge.js";
import type { PageInfoClass } from "@/graphql/misc/pageInfo.js";
import { builder } from "@/builder.js";
import { PageInfo } from "@/graphql/misc/pageInfo.js";
import {
  StorageProviderObjectEdge,

} from "./storageProviderObjectEdge.js";

export const StorageProviderObjectConnection
  = builder.objectRef<StorageProviderObjectConnectionClass>("StorageProviderObjectConnection");

builder.objectType(StorageProviderObjectConnection, {
  fields: t => ({
    edges: t.field({
      type: [StorageProviderObjectEdge],
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

export class StorageProviderObjectConnectionClass {
  edges!: StorageProviderObjectEdgeClass[];
  pageInfo!: PageInfoClass;
}
