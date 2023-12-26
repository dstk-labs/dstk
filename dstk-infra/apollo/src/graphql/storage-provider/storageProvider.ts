import { builder } from '../../builder.js';
import { Model } from 'objection';
import { ObjectionMLModel } from '../model/model.js';
import Security from '../../utils/encryption.js';

const EncryptoMatic = new Security();

export const StorageProvider = builder.objectRef<ObjectionStorageProvider>('StorageProvider').implement({
    fields: (t) => ({
        providerId: t.field({
            type: 'ID',
            resolve(root: ObjectionStorageProvider, _args, _ctx) {
                return root.$modelClass.idColumn[0];
            },
        }),
        endpointUrl: t.exposeString('endpointUrl'),
        region: t.exposeString('region'),
        bucket: t.exposeString('bucket'),

        accessKeyId: t.string({
            resolve(root) {
                return EncryptoMatic.decrypt(root.accessKeyId);
            },
        }),

        createdBy: t.exposeString('createdBy'),
        modifiedBy: t.exposeString('modifiedBy'),
        owner: t.exposeString('owner'),
        dateCreated: t.exposeString('dateCreated'),
        dateModified: t.exposeString('dateModified'),
        isArchived: t.exposeBoolean('isArchived'),
    }),
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
                from: 'registry.storageProviders.providerId',
                to: 'registry.models.storageProviderId',
            },
        },
    });
}
