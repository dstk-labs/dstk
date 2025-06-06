import type { Selectable } from 'kysely';
import { builder } from '../../builder.js';
import type { DstkMetadataCursors } from '../../db/db.js';

export type KyselyCursor = Selectable<DstkMetadataCursors>;

export const Cursor = builder.objectRef<KyselyCursor>('Cursor');

export const CursorRelation = builder.enumType('CursorRelation', {
    values: ['model', 'model_version'] as const,
});

builder.objectType(Cursor, {
    fields: (t) => ({
        cursorToken: t.exposeString('cursor_token'),
        cursorRelation: t.field({
            type: CursorRelation,
            resolve(root, _args, _ctx) {
                return root.cursor_relation;
            },
        }),
        expiration: t.field({
            type: 'String',
            resolve(root: KyselyCursor, _args, _ctx) {
                return root.expiration.toISOString();
            },
        }),
    }),
});
