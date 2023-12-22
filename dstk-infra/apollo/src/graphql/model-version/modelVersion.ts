import { objectType } from 'nexus';
import { MLModel, ObjectionMLModel } from '../model/model.js';
import { Model } from 'objection';
import { ObjectionStorageProvider } from '../storage-provider/storageProvider.js';

export const MLModelVersion = objectType({
    name: 'MLModelVersion',
    definition(t) {
        t.id('modelVersionId');
        t.field('modelId', {
            type: MLModel,
            async resolve(root: ObjectionMLModelVersion, _args, _ctx) {
                ObjectionMLModel.query().findById(root.modelId).first();
            },
        });
        t.boolean('isArchived');
        t.boolean('isFinalized');
        t.string('createdBy'); // TODO: Resolve actual user object
        t.int('numericVersion');
        t.string('description');
        // TODO: Custom Scalar Type for JSON Object: t.something('metadata')
        t.string('dateCreated');
        t.string('s3Prefix');
    },
});

export class ObjectionMLModelVersion extends Model {
    id!: string;
    modelId!: string;
    isArchived!: boolean;
    createdBy!: string;
    numericVersion!: number;
    description: string;
    isFinalized!: boolean;
    s3Prefix: string;
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
