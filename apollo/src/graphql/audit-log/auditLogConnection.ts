import type { AuditLogEdgeClass } from "./auditLogEdge.js";
import type { PageInfoClass } from "@/graphql/misc/pageInfo.js";
import { builder } from "@/builder.js";
import { PageInfo } from "@/graphql/misc/pageInfo.js";
import { AuditLogEdge } from "./auditLogEdge.js";

export const AuditLogConnection = builder.objectRef<AuditLogConnectionClass>("AuditLogConnection");

builder.objectType(AuditLogConnection, {
  fields: t => ({
    edges: t.field({
      type: [AuditLogEdge],
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

export class AuditLogConnectionClass {
  edges!: AuditLogEdgeClass[];
  pageInfo!: PageInfoClass;
}
