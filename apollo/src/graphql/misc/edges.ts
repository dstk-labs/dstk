import { Model } from 'objection';


export class ObjectionEdge extends Model {
    id!: number;
    type!: string;

    static tableName = 'dstkMetadata.edgeRelations';
}