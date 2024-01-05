import { builder } from '../../builder.js';
import { Model } from 'objection';
import { StorageProvider, ObjectionStorageProvider } from '../storage-provider/storageProvider.js';
import { MLModelVersion, ObjectionMLModelVersion } from '../model-version/modelVersion.js';
import { User, ObjectionUser } from '../user/user.js';
import { ObjectionMLModelCursor } from '../metadata/modelCursor.js';

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
                    .first()) as typeof StorageProvider.$inferType;
                return storageProvider;
            },
        }),

        currentModelVersion: t.field({
            type: MLModelVersion,
            async resolve(root: ObjectionMLModel, _args, _ctx) {
                const currentModelVersion = (await ObjectionMLModelVersion.query()
                    .findById(root.currentModelVersionId)
                    .first()) as typeof MLModelVersion.$inferType;

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
    storageProviderId!: string;
    currentModelVersionId!: string;
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
    });
}
