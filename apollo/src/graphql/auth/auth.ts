import { builder } from '../../builder.js';
import { Model, AnyQueryBuilder } from 'objection';
import { User, ObjectionUser } from '../user/user.js';

export const ApiKey = builder.objectRef<ObjectionApiKey>('ApiKey');

builder.objectType(ApiKey, {
    fields: (t) => ({
        apiKeyId: t.field({
            type: 'ID',
            resolve(root: ObjectionApiKey, _args, _ctx) {
                return root.$id();
            },
        }),
        apiKey: t.exposeString('apiKey'),
        isArchived: t.exposeBoolean('isArchived'),
        dateCreated: t.exposeString('dateCreated'),
        user: t.field({
            type: User,
            async resolve(root: ObjectionApiKey, _args, _ctx) {
                const user = (await root.$relatedQuery('userEmail')
                    .for(root.id)
                    .first()) as ObjectionUser;
                return user;
            },
        }),
    }),
});

export class ObjectionApiKey extends Model {
    id!: number;
    apiKeyId!: string;
    userId!: number;
    apiKey!: string;
    isArchived!: boolean;
    dateCreated!: string;

    user!: ObjectionUser;

    static tableName = 'dstkUser.apiKey';

    static relationMappings = () => ({
        userEmail: {
            relation: Model.HasOneRelation,
            modelClass: ObjectionUser,
            join: {
                from: 'dstkUser.apiKey.userId',
                to: 'dstkUser.user.id',
            },
        },
    });
}
