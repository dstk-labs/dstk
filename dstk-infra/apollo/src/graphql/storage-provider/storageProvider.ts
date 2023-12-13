import { objectType } from 'nexus';
import { Model } from 'objection';
import { ObjectionMLModel } from '../model/model.js';

export const StorageProvider = objectType({
    name: 'StorageProvider',
    definition(t) {
        t.id('providerId');
        t.string('endpointUrl');
        t.string('region');
        t.string('bucket');
        t.string('accessKeyId');
        t.string('secretAccessKey');
        t.string('createdBy'); // TODO: resolve actual user object
        t.string('modifiedBy');
        t.string('owner');
        t.string('dateCreated');
        t.string('dateModified');
        t.boolean('isArchived');
    },
});

export class ObjectionStorageProvider extends Model {
    id!: string;
    endpointUrl!: string;
    region!: string;
    bucket!: string;
    accessKeyId!: string;
    secretAccessKey!: string;
    createdBy!: string;
    modifiedBy!: string;
    owner!: string;
    dateCreated!: string;
    dateModified!: string;
    isArchived!: boolean;

    static tableName = 'registry.storageProviders';
    static get idColumn() {
        return 'providerId';
    }

    static relationMappings = () => ({
        models: {
            relation: Model.HasManyRelation,
            modelClass: ObjectionMLModel,
            join: {
                from: 'registry.storageProviders.id',
                to: 'registry.models.storageProviderId',
            },
        },
    });
}
