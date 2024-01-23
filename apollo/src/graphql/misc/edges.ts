import { Model } from 'objection';
import { builder } from '../../builder.js';

export const Role = builder.objectRef<ObjectionEdge>('Role');

builder.objectType(Role, {
    fields: (t) => ({
        name: t.exposeString('type'),
        description: t.exposeString('description'),
    }),
});

export class ObjectionEdge extends Model {
    id!: number;
    type!: string;
    description!: string;

    static tableName = 'dstkMetadata.edgeRelations';
}