import { objectType } from 'nexus';
import { MLModel, ObjectionMLModel } from '../model/model';
import { Model } from 'objection';

export const MLModelVersion = objectType({
    name: 'MLModel',
    definition(t) {
        t.id('modelVersionId');
        t.field('modelId', {
            type: MLModel,
            async resolve(root: ObjectionMLModelVersion, _args, _ctx) {
                ObjectionMLModel.query().findById(root.modelId).first();
            },
        });
        t.boolean('isArchived');
        t.string('createdBy'); // TODO: Resolve actual user object
        t.int('numericVersion');
        t.string('description');
        // TODO: Custom Scalar Type for JSON Object: t.something('metadata')
        t.string('dateCreated');
    },
});

export class ObjectionMLModelVersion extends Model {
    id!: string;
    modelId!: string;
    isArchived!: boolean;
    createdBy!: string;
    numericVersion!: number;
    description: string;
    // TODO: metadata: something
    dateCreated!: string;

    static tableName = 'registry.modelVersions';
    static get idColumn() {
        return 'modelVersionId';
    }
}
