import { betterAuth } from 'better-auth';
import { admin, apiKey, organization, jwt, twoFactor } from 'better-auth/plugins';
import { db } from '../db/kysely';

export const auth = betterAuth({
    database: db,
    basePath: '/graphql',
    emailAndPassword: {
        enabled: true,
    },
    // emailVerification: { ... },
    appName: 'dstk',
    plugins: [
        admin({
            schema: {
                user: {
                    modelName: 'dstk_user.user',
                    fields: {
                        banReason: 'ban_reason',
                        banExpires: 'ban_expires',
                    },
                },
                session: {
                    modelName: 'dstk_user.sessions',
                    fields: {
                        impersonatedBy: 'impersonated_by',
                    },
                },
            },
        }),
        apiKey({
            schema: {
                apikey: {
                    modelName: 'dstk_user.api_keys',
                    fields: {
                        userId: 'user_id',
                        refillInterval: 'refill_interval',
                        refillAmount: 'refill_amount',
                        lastRefillAt: 'last_refill_at',
                        rateLimitEnabled: 'rate_limit_enabled',
                        rateLimitTimeWindow: 'rate_limit_time_window',
                        rateLimitMax: 'rate_limit_max',
                        requestCount: 'request_count',
                        lastRequest: 'last_request',
                        expiresAt: 'expires_at',
                        createdAt: 'date_created',
                        updatedAt: 'date_modified',
                    },
                },
            },
        }),
        jwt({
            schema: {
                jwks: {
                    modelName: 'dstk_user.jwks',
                    fields: {
                        publicKey: 'public_key',
                        privateKey: 'private_key',
                        createdAt: 'date_created',
                    },
                },
            },
        }),
        organization({
            teams: {
                enabled: true,
            },
            schema: {
                organization: {
                    modelName: 'dstk_user.organizations',
                    fields: {
                        createdAt: 'date_created',
                    },
                },
                member: {
                    modelName: 'dstk_user.members',
                    fields: {
                        userId: 'user_id',
                        organizationId: 'organization_id',
                        createdAt: 'date_created',
                    },
                },
                invitation: {
                    modelName: 'dstk_user.invitation',
                    fields: {
                        inviterId: 'inviter_id',
                        organizationId: 'organization_id',
                        expiresAt: 'expires_at',
                        createdAt: 'date_created',
                    },
                },
                session: {
                    modelName: 'dstk_user.sessions',
                    fields: {
                        activeOrganizationId: 'active_organization_id',
                    },
                },
                team: {
                    modelName: 'dstk_user.teams',
                    fields: {
                        organizationId: 'organization_id',
                        createdAt: 'date_created',
                        updatedAt: 'date_modified',
                    },
                },
            },
        }),
        twoFactor({
            schema: {
                user: {
                    modelName: 'dstk_user.users',
                    fields: {
                        twoFactorEnabled: 'is_mfa_enabled',
                    },
                },
                twoFactor: {
                    modelName: 'dstk_user.two_factor',
                    fields: {
                        userId: 'user_id',
                        backupCodes: 'backup_codes',
                    },
                },
            },
        }),
    ],
    user: {
        modelName: 'dstk_user.user',
        fields: {
            name: 'real_name',
            emailVerified: 'is_email_verified',
            createdAt: 'date_created',
            updatedAt: 'date_modified',
        },
        additionalFields: {
            user_id: {
                type: 'string',
                required: true,
            },
            is_approved: {
                type: 'boolean',
                required: true,
                defaultValue: false,
            },
        },
    },
    session: {
        modelName: 'dstk_user.sessions',
        fields: {
            userId: 'user_id',
            expiresAt: 'expires_at',
            ipAddress: 'ip_address',
            userAgent: 'user_agent',
            createdAt: 'date_created',
            updatedAt: 'date_modified',
        },
        additionalFields: {
            session_id: {
                type: 'string',
                required: true,
            },
        },
    },
    account: {
        modelName: 'dstk_user.accounts',
        fields: {
            userId: 'user_id',
            accountId: 'account_id',
            providerId: 'provider_id',
            accessToken: 'access_token',
            refreshToken: 'refresh_token',
            accessTokenExpiresAt: 'access_token_expires_at',
            refreshTokenExpiresAt: 'refresh_token_expires_at',
            idToken: 'id_token',
            createdAt: 'date_created',
            updatedAt: 'date_modified',
        },
    },
    verification: {
        modelName: 'dstk_user.verification',
        fields: {
            expiresAt: 'expires_at',
            createdAt: 'date_created',
            updatedAt: 'date_modified',
        },
    },
    apiKey: {
        modelName: 'dstk_user.api_keys',
    },
    advanced: {
        generateId: false,
    },
});
