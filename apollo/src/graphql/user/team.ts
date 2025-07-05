import type { Selectable } from 'kysely';
import { builder } from '../../builder.js';
import type { DstkUserTeams } from '../../db/db.js';

export type KyselyTeam = Selectable<DstkUserTeams>;

export const Team = builder.objectRef<KyselyTeam>('Team');

builder.objectType(Team, {
    fields: (t) => ({
        teamId: t.field({
            type: 'ID',
            resolve(root: KyselyTeam, _args, _ctx) {
                return root.team_id;
            },
        }),
        dateCreated: t.field({
            type: 'String',
            resolve(root: KyselyTeam, _args, _ctx) {
                return root.date_created.toISOString();
            },
        }),
        dateModified: t.field({
            type: 'String',
            resolve(root: KyselyTeam, _args, _ctx) {
                return root.date_modified.toISOString();
            },
        }),
        description: t.exposeString('description'),
        isArchived: t.exposeBoolean('is_archived'),
        name: t.exposeString('name'),
    }),
});
