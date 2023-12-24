import { builder } from '../../builder.js';
import { Model } from 'objection';
// import { ObjectionMLModel } from '../model/model.js';
import Security from '../../utils/encryption.js';

const EncryptoMatic = new Security();

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const StorageProvider = builder.objectRef<any>('StorageProvider').implement({
    fields: (t) => ({
        providerId: t.exposeID('providerId'),
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
/* eslint-enable  @typescript-eslint/no-explicit-any */

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

    // static relationMappings = () => ({
    //     models: {
    //         relation: Model.HasManyRelation,
    //         modelClass: ObjectionMLModel,
    //         join: {
    //             from: 'registry.storageProviders.providerId',
    //             to: 'registry.models.storageProviderId',
    //         },
    //     },
    // });
}
