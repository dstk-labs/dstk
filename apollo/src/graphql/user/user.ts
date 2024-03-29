import { builder } from '../../builder.js';
import { Model, AnyQueryBuilder } from 'objection';
import { ObjectionApiKey } from '../auth/auth.js';
import { ObjectionTeam, ObjectionTeamEdge } from './team.js';

export const User = builder.objectRef<ObjectionUser>('User');

builder.objectType(User, {
    fields: (t) => ({
        userId: t.field({
            type: 'ID',
            resolve(root: ObjectionUser, _args, _ctx) {
                return root.$id();
            },
        }),
        isAdmin: t.exposeBoolean('isAdmin'),
        isApproved: t.exposeBoolean('isApproved'),
        isDisabled: t.exposeBoolean('isDisabled'),
        realName: t.exposeString('realName'),
        userName: t.exposeString('userName'),
        dateCreated: t.exposeString('dateCreated'),
        dateModified: t.exposeString('dateModified'),
        primaryEmail: t.field({
            type: 'String',
            async resolve(root: ObjectionUser, _args, _ctx) {
                const primaryEmail = (await ObjectionUser.relatedQuery('userEmail')
                    .for(root.$id())
                    .where('isPrimary', true)
                    .first()) as ObjectionUserEmail;
                return primaryEmail?.emailAddress;
            },
        }),
    }),
});

export class ObjectionUser extends Model {
    id!: number;
    userId!: string;
    isAdmin!: boolean;
    isApproved!: boolean;
    isDisabled!: boolean;
    isEmailVerified!: boolean;
    isMfaEnrolled!: boolean;
    realName!: string;
    userName!: string;
    dateCreated!: string;
    dateModified!: string;
    password!: string;

    static tableName = 'dstkUser.user';
    static get idColumn() {
        return 'userId';
    }

    static relationMappings = () => ({
        userEmail: {
            relation: Model.HasManyRelation,
            modelClass: ObjectionUserEmail,
            join: {
                from: 'dstkUser.user.userId',
                to: 'dstkUser.email.userId',
            },
        },
        apiKeys: {
            relation: Model.HasManyRelation,
            modelClass: ObjectionApiKey,
            join: {
                from: 'dstkUser.apiKey.userId',
                to: 'dstkUser.user.userId',
            },
        },
        teamEdges: {
            relation: Model.HasManyRelation,
            modelClass: ObjectionTeamEdge,
            join: {
                from: 'dstkUser.user.userId',
                to: 'dstkUser.teamEdges.userId'
            }
        }
    });
}

export class ObjectionUserEmail extends Model {
    id!: number;
    userId!: string;
    emailAddress!: string;
    isVerified!: boolean;
    isPrimary!: boolean;
    verificationCode?: string;
    dateCreated!: string;
    dateModified!: string;

    static tableName = 'dstkUser.email';
    static get idColumn() {
        return 'emailId';
    }
    static modifiers = {
        primaryEmail(query: AnyQueryBuilder) {
            query.where('isPrimary', true);
        },
    };

    static relationMappings = () => ({
        user: {
            relation: Model.HasOneRelation,
            modelClass: ObjectionUser,
            join: {
                from: 'dstkUser.email.userId',
                to: 'dstkUser.user.userId',
            },
        },
    });
}

export class ObjectionRefreshToken extends Model {
    id!: number;
    sessionId!: string;
    sessionFamily!: string;
    userId!: string;
    isPartial!: boolean;
    isRevoked!: boolean;
    sessionIat!: string;
    sessionExp!: string;

    static tableName = 'dstkUser.refreshToken';
    static get idColumn() {
        return 'sessionId';
    }
}