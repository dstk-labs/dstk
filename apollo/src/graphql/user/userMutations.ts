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
        .insertInto("dstkUser.apiKey")
        .values({
          userId: ctx.user.id,
          apiKey: uuidv4().replace(/-/g, ""),
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
          .updateTable("dstkUser.apiKey")
          .set({
            isArchived: true,
          })
          .where(({ eb, and }) =>
            and([
              eb("dstkUser.apiKey.apiKeyId", "=", args.apiKeyId),
              eb("dstkUser.apiKey.userId", "=", ctx.user.id),
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
        .selectFrom("dstkUser.invitations")
        .selectAll()
        .where("dstkUser.invitations.id", "=", args.invitationId)
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
        .selectFrom("dstkUser.invitations")
        .selectAll()
        .where("dstkUser.invitations.id", "=", args.invitationId)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" }),
        );
    },
  }),
}));
