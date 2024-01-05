import { builder } from '../../builder.js';
import { MLModel } from '../model/model.js';
import { Model } from 'objection';

export const MLModelCursor = builder.objectRef<ObjectionMLModelCursor>('MLModelCursor');

builder.objectType(MLModelCursor, {
    fields: (t) => ({
        cursorId: t.exposeString('cursorId'),
        cursorToken: t.exposeString('cursorToken'),
        resultId: t.exposeString('resultId'),
        expiration: t.exposeString('expiration'),
    }),
});

export class ObjectionMLModelCursor extends Model {
    id!: number;
    cursorId!: string;
    cursorToken!: string;
    resultId!: string;
    expiration!: string;

    static tableName = 'metadata.modelCursors';
    static getIdColumn() {
        return 'cursorId';
    }
}
