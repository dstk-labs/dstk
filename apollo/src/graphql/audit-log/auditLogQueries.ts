import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";
import { queryNamespace } from "@/graphql/misc/namespace.js";
import { pageArgs, paginate } from "@/graphql/misc/pagination.js";
import { RegistryOperationError } from "@/utils/errors.js";
import { AuditAction, AuditResourceType } from "./auditLog.js";
import { AuditLogConnection } from "./auditLogConnection.js";

const AuditLogQuery = queryNamespace("auditLog", "AuditLogQuery");

builder.objectFields(AuditLogQuery, t => ({
  list: t.field({
    type: AuditLogConnection,
    authScopes: {
      loggedIn: true,
    },
    args: {
      ...pageArgs,
      teamId: t.arg.string({ required: true }),
      action: t.arg({ type: AuditAction }),
      resourceType: t.arg({ type: AuditResourceType }),
      actorId: t.arg.string(),
      resourceName: t.arg.string(),
    },
    async resolve(_root, args, ctx) {
      await db
        .selectFrom("dstkUser.members")
        .select("dstkUser.members.id")
        .where("dstkUser.members.userId", "=", ctx.user.id)
        .where("dstkUser.members.teamId", "=", args.teamId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" }),
        );

      let query = db
        .selectFrom("dstkUser.auditLogs")
        .selectAll()
        .where("dstkUser.auditLogs.teamId", "=", args.teamId);

      if (args.action) {
        query = query.where("dstkUser.auditLogs.action", "=", args.action);
      }

      if (args.resourceType) {
        query = query.where("dstkUser.auditLogs.resourceType", "=", args.resourceType);
      }

      if (args.actorId) {
        query = query.where("dstkUser.auditLogs.actorId", "=", args.actorId);
      }

      if (args.resourceName) {
        query = query.where("dstkUser.auditLogs.resourceName", "ilike", `%${args.resourceName}%`);
      }

      return paginate(query, ["dstkUser.auditLogs.dateCreated", "dstkUser.auditLogs.id"], args, "desc");
    },
  }),
}));
