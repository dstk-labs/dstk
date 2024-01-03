import { builder } from '../../builder.js';
import { MLModel, ObjectionMLModel } from '../model/model.js';
import { Model } from 'objection';
import { ObjectionStorageProvider } from '../storage-provider/storageProvider.js';
import { User, ObjectionUser } from '../user/user.js';

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
        numericVersion: t.exposeInt('numericVersion'),
        description: t.exposeString('description'),
        dateCreated: t.exposeString('dateCreated'),
        s3Prefix: t.exposeString('s3Prefix'),
        createdBy: t.field({
            type: User,
            async resolve(root: ObjectionMLModelVersion, _args, _ctx) {
                const user = (await root.$relatedQuery('getCreatedBy')
                    .for(root.$id())
                    .first()) as ObjectionUser;
                return user;
            },
        }),
    }),
});

export class ObjectionMLModelVersion extends Model {
    id!: number;
    modelId!: string;
    isArchived!: boolean;
    createdById!: string;
    numericVersion!: number;
    description?: string;
    isFinalized!: boolean;
    s3Prefix?: string;
    // TODO: metadata: something
    dateCreated!: string;

    createdBy!: ObjectionUser;

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
        getCreatedBy: {
            relation: Model.HasOneRelation,
            modelClass: ObjectionUser,
            join: {
                from: 'registry.modelVersions.createdById',
                to: 'dstkUser.user.userId',
            },
        },
    });
}
