import { builder } from '../../builder.js';
import { Model } from 'objection';
import { User, ObjectionUser } from '../user/user.js';
import { ObjectionTeam } from './team.js';

export const Project = builder.objectRef<ObjectionProject>('Project');

builder.objectType(Project, {
    fields: (t) => ({
        projectId: t.field({
            type: 'ID',
            resolve(root: ObjectionProject, _args, _ctx) {
                return root.$id();
            },
        }),
        name: t.exposeString('name'),
        description: t.exposeString('description'),
        isArchived: t.exposeBoolean('isArchived'),
        dateCreated: t.exposeString('dateCreated'),
        dateModified: t.exposeString('dateModified'),
        createdBy: t.field({
            type: User,
            async resolve(root: ObjectionProject, _args, _ctx) {
                const user = (await root.$relatedQuery('getCreatedBy')
                    .for(root.$id())
                    .first()) as ObjectionUser;
                return user;
            },
        }),
        modifiedBy: t.field({
            type: User,
            async resolve(root: ObjectionProject, _args, _ctx) {
                const user = (await root.$relatedQuery('getModifiedBy')
                    .for(root.$id())
                    .first()) as ObjectionUser;
                return user;
            },
        }),
    }),
});

export class ObjectionProject extends Model {
    id!: number;
    projectId!: string;
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

    static tableName = 'dstkUser.projects';
    static get idColumn() {
        return 'projectId';
    }

    static relationMappings = () => ({
        getCreatedBy: {
            relation: Model.HasOneRelation,
            modelClass: ObjectionUser,
            join: {
                from: 'dstkUser.projects.createdById',
                to: 'dstkUser.user.userId',
            },
        },
        getModifiedBy: {
            relation: Model.HasOneRelation,
            modelClass: ObjectionUser,
            join: {
                from: 'dstkUser.projects.modifiedById',
                to: 'dstkUser.user.userId',
            },
        },
        team: {
            relation: Model.HasOneRelation,
            modelClass: ObjectionTeam,
            join: {
                from: 'dstkUser.projects.teamId',
                to: 'dstkUser.teams.teamId',
            },
        }
    });
}
