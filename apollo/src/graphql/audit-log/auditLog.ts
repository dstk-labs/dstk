import type { Selectable } from "kysely";
import type { AuditAction as AuditActionValue, AuditResourceType as AuditResourceTypeValue, DstkUserAuditLogs } from "@/db/db.js";
import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";
import { User } from "@/graphql/user/user.js";

export type KyselyAuditLog = Selectable<DstkUserAuditLogs>;

export const AuditAction = builder.enumType("AuditAction", {
  values: [
    "created",
    "edited",
    "archived",
    "unarchived",
    "published",
    "file_uploaded",
  ] as const satisfies readonly AuditActionValue[],
});

export const AuditResourceType = builder.enumType("AuditResourceType", {
  values: [
    "project",
    "storage_provider",
    "model",
    "model_version",
  ] as const satisfies readonly AuditResourceTypeValue[],
});

export const AuditLog = builder.objectRef<KyselyAuditLog>("AuditLog");

builder.objectType(AuditLog, {
  fields: t => ({
    auditLogId: t.field({
      type: "ID",
      resolve(root: KyselyAuditLog, _args, _ctx) {
        return root.id;
      },
    }),
    action: t.field({
      type: AuditAction,
      resolve(root: KyselyAuditLog, _args, _ctx) {
        return root.action;
      },
    }),
    resourceType: t.field({
      type: AuditResourceType,
      resolve(root: KyselyAuditLog, _args, _ctx) {
        return root.resourceType;
      },
    }),
    resourceId: t.exposeString("resourceId"),
    resourceName: t.exposeString("resourceName"),
    details: t.field({
      type: "JSONObject",
      nullable: true,
      resolve(root: KyselyAuditLog, _args, _ctx) {
        return root.details;
      },
    }),
    dateCreated: t.field({
      type: "String",
      resolve(root: KyselyAuditLog, _args, _ctx) {
        return root.dateCreated.toISOString();
      },
    }),
    actor: t.field({
      type: User,
      nullable: true,
      async resolve(root: KyselyAuditLog, _args, _ctx) {
        if (!root.actorId)
          return null;

        return db
          .selectFrom("dstkUser.users")
          .selectAll()
          .where("dstkUser.users.id", "=", root.actorId)
          .executeTakeFirst();
      },
    }),
  }),
});
