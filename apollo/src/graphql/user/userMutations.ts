import type { KyselyApiKey } from "@/graphql/auth/auth.js";
import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";
import { ApiKey } from "@/graphql/auth/auth.js";
import { Invitation, InvitationMutation } from "@/graphql/invitation/invitation.js";
import { mutationNamespace } from "@/graphql/misc/namespace.js";
import { auth } from "@/utils/auth.js";
import { RegistryOperationError } from "@/utils/errors.js";

type CreatedApiKeyResult = {
  apiKey: KyselyApiKey;
  key: string;
};

export const CreatedApiKey = builder.objectRef<CreatedApiKeyResult>("CreatedApiKey");

builder.objectType(CreatedApiKey, {
  fields: t => ({
    apiKey: t.field({
      type: ApiKey,
      resolve(root: CreatedApiKeyResult, _args, _ctx) {
        return root.apiKey;
      },
    }),
    key: t.exposeString("key"),
  }),
});

const ApiKeyMutation = mutationNamespace("apiKey", "ApiKeyMutation");

builder.objectFields(ApiKeyMutation, t => ({
  create: t.field({
    type: CreatedApiKey,
    authScopes: {
      loggedIn: true,
    },
    args: {
      name: t.arg.string(),
    },
    async resolve(_root, args, ctx) {
      const { id, key } = await auth.api.createApiKey({
        headers: ctx.headers,
        body: {
          name: args.name || undefined,
        },
      });

      const apiKey = await db
        .selectFrom("dstkUser.apiKeys")
        .selectAll()
        .where("dstkUser.apiKeys.id", "=", id)
        .executeTakeFirstOrThrow();

      return { apiKey, key };
    },
  }),
  archive: t.field({
    type: ApiKey,
    authScopes: {
      loggedIn: true,
    },
    args: {
      apiKeyId: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      await auth.api.updateApiKey({
        headers: ctx.headers,
        body: {
          keyId: args.apiKeyId,
          enabled: false,
        },
      });

      return db
        .selectFrom("dstkUser.apiKeys")
        .selectAll()
        .where(({ eb, and }) =>
          and([
            eb("dstkUser.apiKeys.id", "=", args.apiKeyId),
            eb("dstkUser.apiKeys.userId", "=", ctx.user.id),
          ]),
        )
        .executeTakeFirstOrThrow();
    },
  }),
}));

builder.objectFields(InvitationMutation, t => ({
  accept: t.field({
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
  reject: t.field({
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
