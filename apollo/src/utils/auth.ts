import { betterAuth } from "better-auth";
import { env } from "../config/env.js";
import { pool } from "../db/kysely.js";
import { transporter } from "./smtp.js";
import { createTeam } from "./teamUtils.js";

export const auth = betterAuth({
  /* 🚨 NOTE 🚨
     You must set the baseURL when using oauth providers to
     avoid `redirect_uri_mismatch` errors.
  */
  baseURL: "http://localhost:4000",
  database: pool,
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: (profile) => {
        return {
          user_name: profile.email.split("@")[0],
        };
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await transporter.sendMail({
        from: "no-reply@dstk.org",
        to: user.email,
        subject: "DSTK | Email Verification",
        html: `Click the link to verify your email: http://localhost:5173/auth${url}`,
      });
    },
  },
  appName: "dstk",
  user: {
    modelName: "dstk_user.user",
    fields: {
      name: "real_name",
      emailVerified: "is_email_verified",
      createdAt: "date_created",
      updatedAt: "date_modified",
    },
    additionalFields: {
      user_id: {
        type: "string",
        required: false,
      },
      user_name: {
        type: "string",
        required: true,
      },
    },
  },
  session: {
    modelName: "dstk_user.sessions",
    fields: {
      userId: "user_id",
      expiresAt: "expires_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
      createdAt: "date_created",
      updatedAt: "date_modified",
    },
  },
  account: {
    modelName: "dstk_user.accounts",
    fields: {
      userId: "user_id",
      accountId: "account_id",
      providerId: "provider_id",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      idToken: "id_token",
      createdAt: "date_created",
      updatedAt: "date_modified",
    },
  },
  verification: {
    modelName: "dstk_user.verifications",
    fields: {
      expiresAt: "expires_at",
      createdAt: "date_created",
      updatedAt: "date_modified",
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "dev" ? "none" : "Lax",
      secure: true,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await createTeam({
            description: `${user.user_name}'s private team. Automatically created by DSTK.`,
            name: "Personal Team",
            /* According to docs: https://www.better-auth.com/docs/concepts/database#database-hooks
                Additional fields are supported, however full type inference for these fields isn't yet supported.
                Improved type support is planned
            */
            userId: user.user_id as string,
          });
        },
      },
    },
  },
});
