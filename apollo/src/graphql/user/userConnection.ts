import type { UserEdgeClass } from "./userEdge.js";
import type { PageInfoClass } from "@/graphql/misc/pageInfo.js";
import { builder } from "@/builder.js";
import { PageInfo } from "@/graphql/misc/pageInfo.js";
import { UserEdge } from "./userEdge.js";

export const UserConnection = builder.objectRef<UserConnectionClass>("UserConnection");

builder.objectType(UserConnection, {
  fields: t => ({
    edges: t.field({
      type: [UserEdge],
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

export class UserConnectionClass {
  edges!: UserEdgeClass[];
  pageInfo!: PageInfoClass;
}
