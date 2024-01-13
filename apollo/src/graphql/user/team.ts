import { builder } from '../../builder.js';
import { Model, AnyQueryBuilder } from 'objection';
import { User, ObjectionUser } from '../user/user.js';
import { ObjectionEdge } from '../misc/edges.js';
import { RegistryOperationError } from '../../utils/errors.js';
import { ObjectionProject } from './project.js';
import { ObjectionStorageProvider } from '../storage-provider/storageProvider.js';

export const Team = builder.objectRef<ObjectionTeam>('Team');

builder.objectType(Team, {
    fields: (t) => ({
        teamId: t.field({
            type: 'ID',
            resolve(root: ObjectionTeam, _args, _ctx) {
                return root.$id();
            },
        }),
        name: t.exposeString('name'),
        description: t.exposeString('description'),
        dateCreated: t.exposeString('dateCreated'),
        dateModified: t.exposeString('dateModified'),
        createdBy: t.field({
            type: User,
            async resolve(root: ObjectionTeam, _args, _ctx) {
                const user = (await root.$relatedQuery('getCreatedBy')
                    .for(root.$id())
                    .first()) as ObjectionUser;
                return user;
            },
        }),
        modifiedBy: t.field({
            type: User,
            async resolve(root: ObjectionTeam, _args, _ctx) {
                const user = (await root.$relatedQuery('getModifiedBy')
                    .for(root.$id())
                    .first()) as ObjectionUser;
                return user;
            },
        }),
    }),
});

export class ObjectionTeam extends Model {
    id!: number;
    teamId!: string;
    name!: string;
    description!: string;
    isArchived!: boolean;
    dateCreated!: string;
    dateModified!: string;
    createdById!: string;
    modifiedById!: string;

    createdBy!: ObjectionUser;
    modifiedBy!: ObjectionUser;

    static tableName = 'dstkUser.teams';
    static get idColumn() {
        return 'teamId';
    }

    static modifiers = {
        filterByEdgeType(_builder: AnyQueryBuilder, edgeType: number) {
            _builder.withGraphJoined('teamMembers')
                .where('dstkUser.teamEdges.edgeType', edgeType);
        },
    }

    static relationMappings = () => ({
        getCreatedBy: {
            relation: Model.HasOneRelation,
            modelClass: ObjectionUser,
            join: {
                from: 'dstkUser.teams.createdById',
                to: 'dstkUser.user.userId',
            },
        },
        getModifiedBy: {
            relation: Model.HasOneRelation,
            modelClass: ObjectionUser,
            join: {
                from: 'dstkUser.teams.modifiedById',
                to: 'dstkUser.user.userId',
            },
        },
        teamMembers: {
            relation: Model.ManyToManyRelation,
            modelClass: ObjectionUser,
            join: {
                from: 'dstkUser.teams.teamId',
                through: {
                    from: 'dstkUser.teamEdges.teamId',
                    to: 'dstkUser.teamEdges.userId'
                },
                to: 'dstkUser.user.userId',
            },
        },
        projects: {
            relation: Model.HasManyRelation,
            modelClass: ObjectionProject,
            join: {
                from: 'dstkUser.teams.teamId',
                to: 'dstkUser.projects.teamId',
            },
        },
        storageProviders: {
            relation: Model.HasManyRelation,
            modelClass: ObjectionStorageProvider,
            join: {
                from: 'dstkUser.teams.teamId',
                to: 'registry.storageProviders.teamId'
            },
        },
    });
}

export class ObjectionTeamEdge extends Model {
    id!: number;
    teamId!: string;
    edgeType!: number;
    userId!: string;

    static tableName = 'dstkUser.teamEdges';

    static async userHasRole(userId: string, teamId: string, roles: string[]) {
        const auth = await ObjectionTeamEdge.query()
            .withGraphJoined('edgeTypeMapping')
            .whereIn('edgeTypeMapping.type', roles)
            .where({
                userId: userId,
                teamId: teamId,
            });
        if (!Array.isArray(auth) || !auth.length) {
            throw new RegistryOperationError({ name: 'TEAM_PERMISSION_ERROR' });
        }
    }

    static relationMappings = () => ({
        user: {
            relation: Model.HasOneRelation,
            modelClass: ObjectionUser,
            join: {
                from: 'dstkUser.teamEdges.userId',
                to: 'dstkUser.user.userId'
            },
        },
        team: {
            relation: Model.HasOneRelation,
            modelClass: ObjectionTeam,
            join: {
                from: 'dstkUser.teamEdges.teamId',
                to: 'dstkUser.teams.teamId'
            },
        },
        edgeTypeMapping: {
            relation: Model.HasOneRelation,
            modelClass: ObjectionEdge,
            join: {
                from: 'dstkUser.teamEdges.edgeType',
                to: 'dstkMetadata.edgeRelations.id'
            },
        },
    });
}
