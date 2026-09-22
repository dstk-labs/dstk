import type { Context } from "@/builder.js";
import { builder } from "@/builder.js";
import { auth } from "@/utils/auth.js";
import { handleAuthCookies } from "@/utils/cookie-monster.js";
import { AccountError } from "@/utils/errors.js";

type TwoFactorEnrollmentResult = {
  totpUri: string;
  backupCodes: string[];
};

export const TwoFactorEnrollment = builder.objectRef<TwoFactorEnrollmentResult>(
  "TwoFactorEnrollment",
);

builder.objectType(TwoFactorEnrollment, {
  fields: t => ({
    totpUri: t.exposeString("totpUri"),
    backupCodes: t.exposeStringList("backupCodes"),
  }),
});

export const TwoFactorCodeInputType = builder.inputType("TwoFactorCodeInput", {
  fields: t => ({
    code: t.string({ required: true }),
    trustDevice: t.boolean({ defaultValue: false }),
  }),
});

export const TwoFactorPasswordInputType = builder.inputType("TwoFactorPasswordInput", {
  fields: t => ({
    password: t.string({ required: true }),
  }),
});

async function verifyCode(
  ctx: Context,
  verify: () => Promise<{ headers: Headers }>,
): Promise<boolean> {
  const { headers } = await verify();
  await handleAuthCookies({ headers, ctx });

  return true;
}

builder.mutationFields(t => ({
  enableTwoFactor: t.field({
    type: TwoFactorEnrollment,
    authScopes: {
      loggedIn: true,
    },
    args: {
      data: t.arg({ type: TwoFactorPasswordInputType, required: true }),
    },
    async resolve(_root, args, ctx) {
      try {
        const response = await auth.api.enableTwoFactor({
          headers: ctx.headers,
          body: {
            password: args.data.password,
          },
        });

        return {
          totpUri: response.totpURI,
          backupCodes: response.backupCodes,
        };
      }
      catch {
        throw new AccountError({ name: "TWO_FACTOR_ENABLE_ERROR" });
      }
    },
  }),
  disableTwoFactor: t.field({
    type: "Boolean",
    authScopes: {
      loggedIn: true,
    },
    args: {
      data: t.arg({ type: TwoFactorPasswordInputType, required: true }),
    },
    async resolve(_root, args, ctx) {
      try {
        const { headers, response } = await auth.api.disableTwoFactor({
          headers: ctx.headers,
          returnHeaders: true,
          body: {
            password: args.data.password,
          },
        });

        await handleAuthCookies({ headers, ctx });

        return response.status;
      }
      catch {
        throw new AccountError({ name: "TWO_FACTOR_DISABLE_ERROR" });
      }
    },
  }),
  regenerateBackupCodes: t.stringList({
    authScopes: {
      loggedIn: true,
    },
    args: {
      data: t.arg({ type: TwoFactorPasswordInputType, required: true }),
    },
    async resolve(_root, args, ctx) {
      try {
        const response = await auth.api.generateBackupCodes({
          headers: ctx.headers,
          body: {
            password: args.data.password,
          },
        });

        return response.backupCodes;
      }
      catch {
        throw new AccountError({ name: "TWO_FACTOR_ENABLE_ERROR" });
      }
    },
  }),
  sendTwoFactorOtp: t.field({
    type: "Boolean",
    authScopes: {
      $any: {
        anonymousRequest: true,
        loggedIn: true,
      },
    },
    async resolve(_root, _args, ctx) {
      try {
        const response = await auth.api.sendTwoFactorOTP({
          headers: ctx.headers,
          body: {},
        });

        return response.status;
      }
      catch {
        throw new AccountError({ name: "TWO_FACTOR_OTP_SEND_ERROR" });
      }
    },
  }),
  verifyTotp: t.field({
    type: "Boolean",
    authScopes: {
      $any: {
        anonymousRequest: true,
        loggedIn: true,
      },
    },
    args: {
      data: t.arg({ type: TwoFactorCodeInputType, required: true }),
    },
    async resolve(_root, args, ctx) {
      return verifyCode(ctx, async () => {
        try {
          return await auth.api.verifyTOTP({
            headers: ctx.headers,
            returnHeaders: true,
            body: {
              code: args.data.code,
              trustDevice: args.data.trustDevice ?? false,
            },
          });
        }
        catch {
          throw new AccountError({ name: "TWO_FACTOR_CODE_ERROR" });
        }
      });
    },
  }),
  verifyTwoFactorOtp: t.field({
    type: "Boolean",
    authScopes: {
      $any: {
        anonymousRequest: true,
        loggedIn: true,
      },
    },
    args: {
      data: t.arg({ type: TwoFactorCodeInputType, required: true }),
    },
    async resolve(_root, args, ctx) {
      return verifyCode(ctx, async () => {
        try {
          return await auth.api.verifyTwoFactorOTP({
            headers: ctx.headers,
            returnHeaders: true,
            body: {
              code: args.data.code,
              trustDevice: args.data.trustDevice ?? false,
            },
          });
        }
        catch {
          throw new AccountError({ name: "TWO_FACTOR_CODE_ERROR" });
        }
      });
    },
  }),
  verifyBackupCode: t.field({
    type: "Boolean",
    authScopes: {
      $any: {
        anonymousRequest: true,
        loggedIn: true,
      },
    },
    args: {
      data: t.arg({ type: TwoFactorCodeInputType, required: true }),
    },
    async resolve(_root, args, ctx) {
      return verifyCode(ctx, async () => {
        try {
          return await auth.api.verifyBackupCode({
            headers: ctx.headers,
            returnHeaders: true,
            body: {
              code: args.data.code,
              trustDevice: args.data.trustDevice ?? false,
            },
          });
        }
        catch {
          throw new AccountError({ name: "TWO_FACTOR_BACKUP_CODE_ERROR" });
        }
      });
    },
  }),
}));
