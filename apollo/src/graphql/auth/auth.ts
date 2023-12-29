import { builder } from '../../builder.js';
import { Model, AnyQueryBuilder } from 'objection';
import { ObjectionUser } from '../user/user.js';

export const ApiKey = builder.objectRef<ObjectionApiKey>('ApiKey');

builder.objectType(ApiKey, {
    fields: (t) => ({
        apiKeyId: t.field({
            type: 'ID',
            resolve(root: ObjectionApiKey, _args, _ctx) {
                return root.$id();
            },
        }),
        userId: t.exposeString('userId'),
        apiKey: t.exposeString('apiKey'),
        isArchived: t.exposeBoolean('isArchived'),
        dateCreated: t.exposeString('dateCreated'),
    }),
});

export class ObjectionApiKey extends Model {
    id!: string;
    userId!: string;
    apiKey!: string;
    isArchived!: boolean;
    dateCreated!: string;

    static tableName = 'dstkUser.apiKey';
    static get idColumn() {
        return 'apiKeyId';
    }

    static relationMappings = () => ({
        userEmail: {
            relation: Model.HasOneRelation,
            modelClass: ObjectionUser,
            join: {
                from: 'dstkUser.apiKey.userId',
                to: 'dstkUser.user.userId',
            },
        },
    });
}
