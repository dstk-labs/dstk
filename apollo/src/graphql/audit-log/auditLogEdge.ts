import type { KyselyAuditLog } from "./auditLog.js";
import { builder } from "@/builder.js";
import { AuditLog } from "./auditLog.js";

export const AuditLogEdge = builder.objectRef<AuditLogEdgeClass>("AuditLogEdge");

builder.objectType(AuditLogEdge, {
  fields: t => ({
    cursor: t.exposeString("cursor", { nullable: true }),
    node: t.field({
      type: AuditLog,
      async resolve(root, _args, _ctx) {
        return root.node;
      },
    }),
  }),
});

export class AuditLogEdgeClass {
  cursor?: string;
  node!: KyselyAuditLog;
}
