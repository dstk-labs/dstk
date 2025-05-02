import { Selectable } from 'kysely';
import { builder } from '../../builder.js';
import { DstkMetadataEdgeRelations } from '../../db/db.js';

export type KyselyEdgeRelations = Selectable<DstkMetadataEdgeRelations>;

export const Role = builder.objectRef<KyselyEdgeRelations>('Role');

builder.objectType(Role, {
    fields: (t) => ({
        name: t.exposeString('type'),
        description: t.exposeString('description'),
    }),
});
