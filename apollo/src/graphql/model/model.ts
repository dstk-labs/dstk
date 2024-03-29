import { builder } from '../../builder.js';
import { Model } from 'objection';
import { StorageProvider, ObjectionStorageProvider } from '../storage-provider/storageProvider.js';
import { MLModelVersion, ObjectionMLModelVersion } from '../model-version/modelVersion.js';
import { User, ObjectionUser } from '../user/user.js';
import { ObjectionProject, Project } from '../user/project.js';
import { ObjectionTeam } from '../user/team.js';

export const MLModel = builder.objectRef<ObjectionMLModel>('MLModel');

builder.objectType(MLModel, {
    fields: (t) => ({
        modelId: t.field({
            type: 'ID',
            resolve(root: ObjectionMLModel, _args, _ctx) {
                return root.$id();
            },
        }),

        storageProvider: t.field({
            type: StorageProvider,
            async resolve(root: ObjectionMLModel, _args, _ctx) {
                const storageProvider = (await ObjectionStorageProvider.query()
                    .findById(root.storageProviderId)
                    .first()) as ObjectionStorageProvider;
                return storageProvider;
            },
        }),

        currentModelVersion: t.field({
            type: MLModelVersion,
            async resolve(root: ObjectionMLModel, _args, _ctx) {
                const currentModelVersion = (await ObjectionMLModelVersion.query()
                    .findById(root.currentModelVersionId)
                    .first()) as ObjectionMLModelVersion;

                return currentModelVersion;
            },
        }),

        project: t.field({
            type: Project,
            async resolve(root: ObjectionMLModel, _args, _ctx) {
                const currentModelVersion = (await ObjectionProject.query()
                    .findById(root.projectId)
                    .first()) as ObjectionProject;

                return currentModelVersion;
            },
        }),

        isArchived: t.exposeBoolean('isArchived'),
        modelName: t.exposeString('modelName'),
        dateCreated: t.exposeString('dateCreated'),
        dateModified: t.exposeString('dateModified'),
        description: t.exposeString('description'),
        createdBy: t.field({
            type: User,
            async resolve(root: ObjectionMLModel, _args, _ctx) {
                const user = (await root
                    .$relatedQuery('getCreatedBy')
                    .for(root.$id())
                    .first()) as ObjectionUser;
                return user;
            },
        }),
        modifiedBy: t.field({
            type: User,
            async resolve(root: ObjectionMLModel, _args, _ctx) {
                const user = (await root
                    .$relatedQuery('getModifiedBy')
                    .for(root.$id())
                    .first()) as ObjectionUser;
                return user;
            },
        }),
    }),
});

export class ObjectionMLModel extends Model {
    id!: number;
    modelId!: string;
    storageProviderId!: string;
    currentModelVersionId!: string;
    projectId!: string;
    isArchived!: boolean;
    modelName!: string;
    createdById!: string;
    modifiedById!: string;
    dateCreated!: string;
    dateModified!: string;
    description!: string;

    modifiedBy!: ObjectionUser;
    createdBy!: ObjectionUser;

    static tableName = 'registry.models';
    static get idColumn() {
        return 'modelId';
    }

    static relationMappings = () => ({
        storageProvider: {
            relation: Model.HasOneRelation,
            modelClass: ObjectionStorageProvider,
            join: {
                from: 'registry.models.storageProviderId',
                to: 'registry.storageProviders.providerId',
            },
        },
        modelVersions: {
            relation: Model.HasManyRelation,
            modelClass: ObjectionMLModelVersion,
            join: {
                from: 'registry.models.modelId',
                to: 'registry.modelVersions.modelId',
            },
        },
        currentModelVersion: {
            relation: Model.HasOneRelation,
            modelClass: ObjectionMLModelVersion,
            join: {
                from: 'registry.models.currentModelVersionId',
                to: 'registry.modelVersions.modelVersionId',
            },
        },
        projects: {
            relation: Model.HasOneRelation,
            modelClass: ObjectionProject,
            join: {
                from: 'registry.models.projectId',
                to: 'dstkUser.projects.projectId',
            },
        },
        getCreatedBy: {
            relation: Model.HasOneRelation,
            modelClass: ObjectionUser,
            join: {
                from: 'registry.models.createdById',
                to: 'dstkUser.user.userId',
            },
        },
        getModifiedBy: {
            relation: Model.HasOneRelation,
            modelClass: ObjectionUser,
            join: {
                from: 'registry.models.modifiedById',
                to: 'dstkUser.user.userId',
            },
        },
        getTeam: {
            relation: Model.HasOneThroughRelation,
            modelClass: ObjectionTeam,
            join: {
                from: 'registry.models.projectId',
                through: {
                    from: 'dstkUser.projects.projectId',
                    to: 'dstkUser.projects.teamId',
                },
                to: 'dstkUser.teams.teamId',
            },
        },
    });
}
