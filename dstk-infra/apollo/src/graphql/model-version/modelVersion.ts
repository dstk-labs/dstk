import { builder } from '../../builder.js';
import { MLModel, ObjectionMLModel } from '../model/model.js';
import { Model } from 'objection';
import { ObjectionStorageProvider } from '../storage-provider/storageProvider.js';

export const MLModelVersion = builder.objectRef<ObjectionMLModelVersion>('MLModelVersion');
builder.objectType(MLModelVersion, {
    fields: (t) => ({
        modelVersionId: t.field({
            type: 'ID',
            resolve(root: ObjectionMLModelVersion, _args, _ctx) {
                return root.$id();
            },
        }),

        modelId: t.field({
            type: MLModel,

            async resolve(root: ObjectionMLModelVersion, _args, _ctx) {
                const mlModel = (await ObjectionMLModel.query()
                    .findById(root.modelId)
                    .first()) as typeof MLModel.$inferType;
                return mlModel;
            },
        }),

        isArchived: t.exposeBoolean('isArchived'),
        isFinalized: t.exposeBoolean('isFinalized'),
        createdBy: t.exposeString('createdBy'),
        numericVersion: t.exposeInt('numericVersion'),
        description: t.exposeString('description'),
        dateCreated: t.exposeString('dateCreated'),
        s3Prefix: t.exposeString('s3Prefix'),
    }),
});

export class ObjectionMLModelVersion extends Model {
    id!: string;
    modelId!: string;
    isArchived!: boolean;
    createdBy!: string;
    numericVersion!: number;
    description?: string;
    isFinalized!: boolean;
    s3Prefix?: string;
    // TODO: metadata: something
    dateCreated!: string;

    static tableName = 'registry.modelVersions';
    static get idColumn() {
        return 'modelVersionId';
    }

    static relationMappings = () => ({
        model: {
            relation: Model.HasOneRelation,
            modelClass: ObjectionMLModel,
            join: {
                from: 'registry.modelVersions.modelId',
                to: 'registry.models.modelId',
            },
        },
        storageProvider: {
            relation: Model.HasOneThroughRelation,
            modelClass: ObjectionStorageProvider,
            join: {
                from: 'registry.modelVersions.modelId',
                through: {
                    from: 'registry.models.modelId',
                    to: 'registry.models.storageProviderId',
                },
                to: 'registry.storageProviders.providerId',
            },
        },
    });
}
