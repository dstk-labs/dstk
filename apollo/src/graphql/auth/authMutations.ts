import { builder } from "@/builder.js";
import { db } from "@/db/kysely.js";
import { User } from "@/graphql/user/user.js";
import { auth } from "@/utils/auth.js";
import { handleAuthCookies } from "@/utils/cookie-monster.js";
import { AccountError } from "@/utils/errors.js";

export const OAuthProviderEnum = builder.enumType("OAuthProvider", {
  values: ["google", "github"] as const,
});

export const AccountInputType = builder.inputType("AccountInput", {
  fields: t => ({
    userName: t.string({ required: true }),
    password: t.string({ required: true }),
    realName: t.string({ required: true }),
    email: t.string({ required: true }),
  }),
});

export const LoginInputType = builder.inputType("LoginInput", {
  fields: t => ({
    email: t.string({ required: true }),
    password: t.string({ required: true }),
    rememberMe: t.boolean({ defaultValue: true }),
  }),
});

export const VerifyEmailInputType = builder.inputType("VerifyEmailInput", {
  fields: t => ({
    token: t.string({ required: true }),
  }),
});

builder.mutationFields(t => ({
  createAccount: t.field({
    type: User,
    authScopes: {
      anonymousRequest: true,
    },
    args: {
      data: t.arg({ type: AccountInputType, required: true }),
    },
    async resolve(_root, args, ctx) {
      const userName = await db
        .selectFrom("dstkUser.users")
        .select("dstkUser.users.userName")
        .where(
          ({ fn }) => fn("lower", ["dstkUser.users.userName"]),
          "=",
          args.data.userName,
        )
        .executeTakeFirst();
      if (userName) {
        throw new AccountError({ name: "USERNAME_IN_USE_ERROR" });
      }

      const { headers, response } = await auth.api.signUpEmail({
        returnHeaders: true,
        body: {
          name: args.data.realName,
          email: args.data.email,
          password: args.data.password,
          userName: args.data.userName,
        },
      });

      await handleAuthCookies({ headers, ctx });

      const user = await db
        .selectFrom("dstkUser.users")
        .selectAll()
        .where("dstkUser.users.id", "=", response.user.id)
        .executeTakeFirstOrThrow();

      return user;
    },
  }),
  login: t.field({
    type: "String",
    authScopes: {
      anonymousRequest: true,
    },
    args: {
      data: t.arg({ type: LoginInputType, required: true }),
    },
    async resolve(_root, args, ctx) {
      let body = {
        email: args.data.email,
        password: args.data.password,
      };

      if (args.data.rememberMe) {
        body = Object.assign({}, body, { rememberMe: args.data.rememberMe });
      }

      const { headers, response } = await auth.api.signInEmail({
        returnHeaders: true,
        body,
      });

      await handleAuthCookies({ headers, ctx });

      return response.token;
    },
  }),
  generateOAuthUrl: t.field({
    type: "String",
    authScopes: {
      anonymousRequest: true,
    },
    args: {
      provider: t.arg({ type: OAuthProviderEnum, required: true }),
      callbackURL: t.arg.string({ required: true }),
    },
    async resolve(_root, args, ctx) {
      const { response, headers } = await auth.api.signInSocial({
        body: {
          provider: args.provider,
          callbackURL: args.callbackURL,
        },
        headers: ctx.headers,
        returnHeaders: true,
      });

      await handleAuthCookies({ headers, ctx });

      return response.url;
    },
  }),
  logout: t.field({
    type: "Boolean",
    authScopes: {
      loggedIn: true,
    },
    async resolve(_root, _args, ctx) {
      const { headers, response } = await auth.api.signOut({
        headers: ctx.headers,
        returnHeaders: true,
      });

      const cookies = headers.get("set-cookie");
      if (cookies) {
        ctx.res.set("Set-Cookie", cookies);
      }

      return response.success;
    },
  }),
  sendVerificationEmail: t.field({
    type: "Boolean",
    authScopes: {
      loggedIn: true,
    },
    async resolve(_root, _args, ctx) {
      try {
        await auth.api.sendVerificationEmail({
          headers: ctx.headers,
          body: {
            email: ctx.user.email,
          },
          returnStatus: true,
        });

        return true;
      }
      catch {
        throw new AccountError({ name: "EMAIL_VERIFICATION_SEND_ERROR" });
      }
    },
  }),
  verifyEmail: t.field({
    type: "Boolean",
    args: {
      data: t.arg({ type: VerifyEmailInputType, required: true }),
    },
    async resolve(_root, args, ctx) {
      try {
        await auth.api.verifyEmail({
          headers: ctx.headers,
          query: {
            token: args.data.token,
          },
        });

        return true;
      }
      catch {
        throw new AccountError({ name: "EMAIL_VERIFICATION_ERROR" });
      }
    },
  }),
}));
