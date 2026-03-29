import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, ownerAc } from "better-auth/plugins/organization/access";
import { env } from "../config/env.js";
import { pool } from "../db/kysely.js";
import { transporter } from "./smtp.js";
import { createTeam } from "./teamUtils.js";

const statement = {
  ...defaultStatements,
  // Can't use team as that is an already baked in permission group from better auth
  dstkTeam: ["archive", "cancelInvite", "edit", "invite"],
  model: ["archive", "create", "edit"],
  modelVersion: ["archive", "create", "download", "edit", "publish"],
  project: ["archive", "create", "edit"],
  storageProvider: ["archive", "create", "edit"],
} as const;

const ac = createAccessControl(statement);

const viewer = ac.newRole({
  dstkTeam: [],
  model: [],
  modelVersion: [],
  project: [],
  storageProvider: [],
});

const member = ac.newRole({
  dstkTeam: [],
  model: ["archive", "create", "edit"],
  modelVersion: ["archive", "create", "download", "edit", "publish"],
  project: ["archive", "create", "edit"],
  storageProvider: ["create", "edit"],
});

const owner = ac.newRole({
  dstkTeam: ["archive", "cancelInvite", "edit", "invite"],
  model: ["archive", "create", "edit"],
  modelVersion: ["archive", "create", "download", "edit", "publish"],
  project: ["archive", "create", "edit"],
  storageProvider: ["archive", "create", "edit"],
  ...ownerAc.statements,
});

export const auth = betterAuth({
  /* 🚨 NOTE 🚨
     You must set the baseURL when using oauth providers to
     avoid `redirect_uri_mismatch` errors.
  */
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
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
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
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
        html: `Click the link to verify your email: ${env.APP_URL}/auth${url}`,
      });
    },
  },
  appName: "dstk",
  user: {
    modelName: "dstk_user.users",
    fields: {
      name: "real_name",
      emailVerified: "is_email_verified",
      createdAt: "date_created",
      updatedAt: "date_modified",
    },
    additionalFields: {
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
  plugins: [
    organization({
      ac,
      roles: {
        viewer,
        member,
        owner,
      },
      schema: {
        organization: {
          modelName: "dstk_user.teams",
          fields: {
            createdAt: "date_created",
            updatedAt: "date_modified",
          },
        },
        member: {
          modelName: "dstk_user.members",
          fields: {
            organizationId: "team_id",
            createdAt: "date_created",
            updatedAt: "date_modified",
          },
        },
        invitation: {
          modelName: "dstk_user.invitations",
          fields: {
            organizationId: "team_id",
            inviterId: "inviter_id",
            expiresAt: "expires_at",
            createdAt: "date_created",
            updatedAt: "date_modified",
          },
        },
      },
      async sendInvitationEmail(data) {
        const inviteLink = `${env.APP_URL}/auth/accept-invitation/${data.id}`;
        await transporter.sendMail({
          from: "no-reply@dstk.org",
          to: data.email,
          // TODO: Fill this out more properly w/ team name, inviter name, etc.
          subject: "DSTK | You've been invited to a team",
          html: `Click the link to accept your invitation: ${inviteLink}`,
        });
      },
    }),
  ],
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
            userId: user.id,
          });
        },
      },
    },
  },
});
