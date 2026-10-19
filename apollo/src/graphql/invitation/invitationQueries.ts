import { z } from "zod";
import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";
import { RegistryOperationError } from "@/utils/errors.js";
import { Invitation, InvitationQuery } from "./invitation.js";

builder.objectFields(InvitationQuery, t => ({
  get: t.field({
    type: Invitation,
    authScopes: {
      loggedIn: true,
    },
    args: {
      invitationId: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      if (!z.uuid().safeParse(args.invitationId).success) {
        throw new RegistryOperationError({ name: "INVITATION_PERMISSION_ERROR" });
      }

      return db
        .selectFrom("dstkUser.invitations")
        .selectAll()
        .where("dstkUser.invitations.id", "=", args.invitationId)
        .where("dstkUser.invitations.email", "=", ctx.user.email)
        .executeTakeFirstOrThrow(
          () => new RegistryOperationError({ name: "INVITATION_PERMISSION_ERROR" }),
        );
    },
  }),
}));
