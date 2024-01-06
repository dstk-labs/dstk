import { builder } from '../../builder.js';
import { Model } from 'objection';

export const CursorRelation = builder.enumType('CursorRelation', {
    values: ['model', 'model_version'] as const,
});

export const Cursor = builder.objectRef<ObjectionCursor>('Cursor');

builder.objectType(Cursor, {
    fields: (t) => ({
        cursorToken: t.exposeString('cursorToken'),
        cursorRelation: t.field({
            type: CursorRelation,
            resolve(root, _args, _ctx) {
                return root.cursorRelation;
            },
        }),
        resultId: t.exposeInt('resultId'),
        expiration: t.exposeString('expiration'),
    }),
});

export class ObjectionCursor extends Model {
    id!: number;
    cursorToken!: string;
    cursorRelation!: 'model' | 'model_version';
    resultId!: number;
    expiration!: string;

    static tableName = 'dstk_metadata.cursors';
    static getIdColumn() {
        return 'cursorId';
    }
}
