import type { PageInfoClass } from "../misc/pageInfo.js";
import type { InvitationEdgeClass } from "./invitationEdge.js";
import { builder } from "../../builder.js";
import { PageInfo } from "../misc/pageInfo.js";
import { InvitationEdge } from "./invitationEdge.js";

export const InvitationConnection = builder.objectRef<InvitationConnectionClass>("InvitationConnection");

builder.objectType(InvitationConnection, {
  fields: t => ({
    edges: t.field({
      type: [InvitationEdge],
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

export class InvitationConnectionClass {
  edges!: InvitationEdgeClass[];
  pageInfo!: PageInfoClass;
}
