import { builder } from '../../builder.js';
import { Model } from 'objection';
import { StorageProvider, ObjectionStorageProvider } from '../storage-provider/storageProvider.js';
import { ObjectionMLModelVersion } from '../model-version/modelVersion.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MLModel = builder.objectRef<any>('MLModel').implement({
    fields: (t) => ({
        modelId: t.exposeID('modelId'),

        storageProvider: t.field({
            type: StorageProvider,
            async resolve(root, _args, _ctx) {
                const storageProvider = (await ObjectionStorageProvider.query()
                    .findById(root.providerId)
                    .first()) as typeof StorageProvider.$inferType;
                return storageProvider;
            },
        }),

        isArchived: t.exposeBoolean('isArchived'),
        modelName: t.exposeString('modelName'),
        createdBy: t.exposeString('createdBy'),
        modifiedBy: t.exposeString('modifiedBy'),
        dateCreated: t.exposeString('dateCreated'),
        dateModified: t.exposeString('dateModified'),
        description: t.exposeString('description'),
    }),
});

export class ObjectionMLModel extends Model {
    id!: string;
    storageProviderId!: string;
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
    });
}
