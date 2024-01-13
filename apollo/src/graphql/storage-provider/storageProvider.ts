import { builder } from '../../builder.js';
import { Model } from 'objection';
import { ObjectionMLModel } from '../model/model.js';
import { User, ObjectionUser } from '../user/user.js';
import { Security } from '../../utils/encryption.js';

const EncryptoMatic = new Security();

export const StorageProvider = builder.objectRef<ObjectionStorageProvider>('StorageProvider');
builder.objectType(StorageProvider, {
    fields: (t) => ({
        providerId: t.field({
            type: 'ID',
            resolve(root: ObjectionStorageProvider, _args, _ctx) {
                return root.$id();
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

        createdBy: t.field({
            type: User,
            async resolve(root: ObjectionStorageProvider, _args, _ctx) {
                const user = (await root
                    .$relatedQuery('getCreatedBy')
                    .for(root.$id())
                    .first()) as ObjectionUser;
                return user;
            },
        }),
        modifiedBy: t.field({
            type: User,
            async resolve(root: ObjectionStorageProvider, _args, _ctx) {
                const user = (await root
                    .$relatedQuery('getModifiedBy')
                    .for(root.$id())
                    .first()) as ObjectionUser;
                return user;
            },
        }),
        owner: t.field({
            type: User,
            async resolve(root: ObjectionStorageProvider, _args, _ctx) {
                const user = (await root
                    .$relatedQuery('getOwner')
                    .for(root.$id())
                    .first()) as ObjectionUser;
                return user;
            },
        }),
        teamId: t.exposeString('teamId'),
        dateCreated: t.exposeString('dateCreated'),
        dateModified: t.exposeString('dateModified'),
        isArchived: t.exposeBoolean('isArchived'),
    }),
});

export class ObjectionStorageProvider extends Model {
    id!: number;
    endpointUrl!: string;
    region!: string;
    bucket!: string;
    accessKeyId!: string;
    secretAccessKey!: string;
    createdById!: string;
    modifiedById!: string;
    ownerId!: string;
    teamId!: string;
    dateCreated!: string;
    dateModified!: string;
    isArchived!: boolean;

    owner!: ObjectionUser;
    modifiedBy!: ObjectionUser;
    createdBy!: ObjectionUser;

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
        getOwner: {
            relation: Model.HasOneRelation,
            modelClass: ObjectionUser,
            join: {
                from: 'registry.storageProviders.ownerId',
                to: 'dstkUser.user.userId',
            },
        },
        getCreatedBy: {
            relation: Model.HasOneRelation,
            modelClass: ObjectionUser,
            join: {
                from: 'registry.storageProviders.createdById',
                to: 'dstkUser.user.userId',
            },
        },
        getModifiedBy: {
            relation: Model.HasOneRelation,
            modelClass: ObjectionUser,
            join: {
                from: 'registry.storageProviders.modifiedById',
                to: 'dstkUser.user.userId',
            },
        },
    });
}
