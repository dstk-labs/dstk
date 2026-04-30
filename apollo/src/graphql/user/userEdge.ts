import type { KyselyUser } from "./user.js";
import { builder } from "@/builder.js";
import { User } from "./user.js";

export const UserEdge = builder.objectRef<UserEdgeClass>("UserEdge");

builder.objectType(UserEdge, {
  fields: t => ({
    cursor: t.exposeString("cursor", { nullable: true }),
    node: t.field({
      type: User,
      async resolve(root, _args, _ctx) {
        return root.node;
      },
    }),
  }),
});

export class UserEdgeClass {
  cursor?: string;
  node!: KyselyUser;
}
