import type { KyselyInvitation } from "./invitation.js";
import { builder } from "../../builder.js";
import { Invitation } from "./invitation.js";

export const InvitationEdge = builder.objectRef<InvitationEdgeClass>("InvitationEdge");

builder.objectType(InvitationEdge, {
  fields: t => ({
    cursor: t.exposeString("cursor", { nullable: true }),
    node: t.field({
      type: Invitation,
      async resolve(root, _args, _ctx) {
        return root.node;
      },
    }),
  }),
});

export class InvitationEdgeClass {
  cursor?: string;
  node!: KyselyInvitation;
}
