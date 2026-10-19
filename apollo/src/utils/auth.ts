import { apiKey } from "@better-auth/api-key";
import { betterAuth } from "better-auth";
import { bearer, deviceAuthorization, organization, twoFactor } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, ownerAc } from "better-auth/plugins/organization/access";
import { env } from "@/config/env.js";
import { db } from "@/db/kysely.js";
import { invitationEmail, passwordResetEmail, signInCodeEmail, verificationEmail } from "./emails.js";
import { sendEmail } from "./smtp.js";
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

const TWO_FACTOR_OTP_MINUTES = 3;

const PYDSTK_CLIENT_ID = "pydstk";

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
  database: { db, type: "postgres" },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: (profile) => {
        return {
          userName: profile.email.split("@")[0],
        };
      },
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      mapProfileToUser: (profile) => {
        return {
          userName: profile.email?.split("@")[0] ?? profile.login,
        };
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, token }) => {
      const resetLink = `${env.APP_URL}/auth/reset-password?token=${token}`;
      await sendEmail(user.email, passwordResetEmail(resetLink));
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verifyLink = `${env.APP_URL}/auth/verify-email?token=${token}`;
      await sendEmail(user.email, verificationEmail(verifyLink));
    },
  },
  appName: "dstk",
  user: {
    modelName: "dstkUser.users",
    fields: {
      name: "realName",
      emailVerified: "isEmailVerified",
      createdAt: "dateCreated",
      updatedAt: "dateModified",
    },
    additionalFields: {
      userName: {
        type: "string",
        required: true,
      },
    },
  },
  session: {
    modelName: "dstkUser.sessions",
    fields: {
      userId: "userId",
      expiresAt: "expiresAt",
      ipAddress: "ipAddress",
      userAgent: "userAgent",
      createdAt: "dateCreated",
      updatedAt: "dateModified",
    },
  },
  account: {
    modelName: "dstkUser.accounts",
    fields: {
      userId: "userId",
      accountId: "betterAuthAccountId",
      providerId: "providerId",
      accessToken: "accessToken",
      refreshToken: "refreshToken",
      accessTokenExpiresAt: "accessTokenExpiresAt",
      refreshTokenExpiresAt: "refreshTokenExpiresAt",
      idToken: "idToken",
      createdAt: "dateCreated",
      updatedAt: "dateModified",
    },
  },
  verification: {
    modelName: "dstkUser.verifications",
    fields: {
      expiresAt: "expiresAt",
      createdAt: "dateCreated",
      updatedAt: "dateModified",
    },
  },
  plugins: [
    bearer(),
    deviceAuthorization({
      verificationUri: `${env.APP_URL}/device`,
      validateClient: clientId => clientId === PYDSTK_CLIENT_ID,
      schema: {
        deviceCode: {
          modelName: "dstkUser.deviceCodes",
        },
      },
    }),
    apiKey({
      enableSessionForAPIKeys: true,
      rateLimit: {
        enabled: false,
      },
      schema: {
        apikey: {
          modelName: "dstkUser.apiKeys",
          fields: {
            referenceId: "userId",
            enabled: "isEnabled",
            rateLimitEnabled: "isRateLimitEnabled",
            createdAt: "dateCreated",
            updatedAt: "dateModified",
          },
        },
      },
    }),
    twoFactor({
      issuer: "DSTK",
      otpOptions: {
        storeOTP: "encrypted",
        sendOTP: async ({ otp, user }) => {
          await sendEmail(user.email, signInCodeEmail(otp, TWO_FACTOR_OTP_MINUTES));
        },
        period: TWO_FACTOR_OTP_MINUTES,
      },
      schema: {
        user: {
          fields: {
            twoFactorEnabled: "isTwoFactorEnabled",
          },
        },
        twoFactor: {
          modelName: "dstkUser.twoFactors",
          fields: {
            verified: "isVerified",
          },
        },
      },
    }),
    organization({
      ac,
      roles: {
        viewer,
        member,
        owner,
      },
      schema: {
        session: {
          fields: {
            activeOrganizationId: "activeTeamId",
          },
        },
        organization: {
          modelName: "dstkUser.teams",
          fields: {
            createdAt: "dateCreated",
            updatedAt: "dateModified",
          },
          additionalFields: {
            isArchived: {
              type: "boolean",
              required: true,
              defaultValue: false,
              input: false,
            },
            createdById: {
              type: "string",
              required: true,
              input: false,
            },
            modifiedById: {
              type: "string",
              required: true,
              input: false,
            },
          },
        },
        member: {
          modelName: "dstkUser.members",
          fields: {
            organizationId: "teamId",
            createdAt: "dateCreated",
            updatedAt: "dateModified",
          },
        },
        invitation: {
          modelName: "dstkUser.invitations",
          fields: {
            organizationId: "teamId",
            inviterId: "inviterId",
            expiresAt: "expiresAt",
            createdAt: "dateCreated",
            updatedAt: "dateModified",
          },
        },
      },
      async sendInvitationEmail(data) {
        const inviteLink = `${env.APP_URL}/invitations/${data.id}`;
        await sendEmail(data.email, invitationEmail({
          inviterName: data.inviter.user.name,
          link: inviteLink,
          role: data.role,
          teamName: data.organization.name,
        }));
      },
    }),
  ],
  advanced: {
    database: {
      generateId: false,
    },
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
            description: `${user.userName}'s private team. Automatically created by DSTK.`,
            name: "Personal Team",
            userId: user.id,
          });
        },
      },
    },
  },
});
