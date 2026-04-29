import { v4 as uuidv4 } from "uuid";
import { builder } from "../../builder.js";
import { db } from "../../db/kysely.js";
import { auth } from "../../utils/auth.js";
import { RegistryOperationError } from "../../utils/errors.js";
import { ApiKey } from "../auth/auth.js";
import { Invitation } from "../invitation/invitation.js";

builder.mutationFields(t => ({
  createApiKey: t.field({
    type: ApiKey,
    authScopes: {
      loggedIn: true,
    },
    async resolve(_root, _args, ctx) {
      return await db
        .insertInto("dstk_user.api_key")
        .values({
          user_id: ctx.user.id,
          api_key: uuidv4().replace(/-/g, ""),
        })
        .returningAll()
        .executeTakeFirst();
    },
  }),
  archiveApiKey: t.field({
    type: ApiKey,
    authScopes: {
      loggedIn: true,
    },
    args: {
      apiKeyId: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      const results = await db.transaction().execute(async (trx) => {
        const userApiKey = await trx
          .updateTable("dstk_user.api_key")
          .set({
            is_archived: true,
          })
          .where(({ eb, and }) =>
            and([
              eb("dstk_user.api_key.api_key_id", "=", args.apiKeyId),
              eb("dstk_user.api_key.user_id", "=", ctx.user.id),
            ]),
          )
          .returningAll()
          .executeTakeFirstOrThrow();

        return userApiKey;
      });
      return results;
    },
  }),
  acceptInvitation: t.field({
    type: Invitation,
    authScopes: {
      loggedIn: true,
    },
    args: {
      invitationId: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      await auth.api.acceptInvitation({
        headers: ctx.headers,
        body: {
          invitationId: args.invitationId,
        },
      });

      return db
        .selectFrom("dstk_user.invitations")
        .selectAll()
        .where("dstk_user.invitations.id", "=", args.invitationId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" }),
        );
    },
  }),
  rejectInvitation: t.field({
    type: Invitation,
    authScopes: {
      loggedIn: true,
    },
    args: {
      invitationId: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      await auth.api.rejectInvitation({
        headers: ctx.headers,
        body: {
          invitationId: args.invitationId,
        },
      });

      return db
        .selectFrom("dstk_user.invitations")
        .selectAll()
        .where("dstk_user.invitations.id", "=", args.invitationId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" }),
        );
    },
  }),
}));
