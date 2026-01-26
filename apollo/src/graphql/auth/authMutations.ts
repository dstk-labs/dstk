import { builder } from "../../builder.js";
import { db } from "../../db/kysely.js";
import { auth } from "../../utils/auth.js";
import { AccountError } from "../../utils/errors.js";
import { User } from "../user/user.js";

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
        .selectFrom("dstk_user.user")
        .select("dstk_user.user.user_name")
        .where(
          ({ fn }) => fn("lower", ["dstk_user.user.user_name"]),
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
          user_name: args.data.userName,
        },
      });

      const cookies = headers.get("set-cookie");
      if (cookies === null) {
        throw new AccountError({ name: "ACCOUNT_REGISTRATION_ERROR" });
      }
      ctx.res.set("Set-Cookie", cookies);

      const user = await db
        .selectFrom("dstk_user.user")
        .selectAll()
        .where("dstk_user.user.id", "=", response.user.id)
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
    async resolve(_args, args, ctx) {
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

      const cookies = headers.get("set-cookie");
      if (cookies === null) {
        throw new AccountError({ name: "LOGIN_ERROR" });
      }
      ctx.res.set("Set-Cookie", cookies);

      return response.token;
    },
  }),
  generateGoogleOAuthUrl: t.field({
    type: "String",
    authScopes: {
      anonymousRequest: true,
    },
    args: {
      callbackURL: t.arg.string({ required: true }),
    },
    async resolve(_args, args, ctx) {
      const { response, headers } = await auth.api.signInSocial({
        body: {
          provider: "google",
          callbackURL: args.callbackURL,
        },
        headers: ctx.headers,
        returnHeaders: true,
      });

      const cookies = headers.get("set-cookie");
      if (cookies) {
        ctx.res.set("Set-Cookie", cookies);
      }

      return response.url;
    },
  }),
  logout: t.field({
    type: "Boolean",
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
