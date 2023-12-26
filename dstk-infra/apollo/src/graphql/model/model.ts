import { builder } from '../../builder.js';
import { Model } from 'objection';
import { StorageProvider, ObjectionStorageProvider } from '../storage-provider/storageProvider.js';
import { MLModelVersion, ObjectionMLModelVersion } from '../model-version/modelVersion.js';

export const MLModel = builder.objectRef<ObjectionMLModel>('MLModel');

builder.objectType(MLModel, {
    fields: (t) => ({
        modelId: t.field({
            type: 'ID',
            resolve(root: ObjectionMLModel, _args, _ctx) {
                return root.$modelClass.idColumn[0];
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

export class ObjectionMLModel extends Model {
    id!: string;
    storageProviderId!: string;
    currentModelVersionId!: string;
    isArchived!: boolean;
    modelName!: string;
    createdBy!: string;
    modifiedBy!: string;
    dateCreated!: string;
    dateModified!: string;
    description!: string;

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
    });
}
