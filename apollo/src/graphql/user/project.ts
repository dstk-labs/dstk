import { builder } from '../../builder.js';
import type { DstkUserProjects } from '../../db/db.js';
import { db } from '../../db/kysely.js';
import { User } from '../user/user.js';
import type { Selectable } from 'kysely';

export type KyselyProject = Selectable<DstkUserProjects>;

export const Project = builder.objectRef<KyselyProject>('Project');
builder.objectType(Project, {
    fields: (t) => ({
        projectId: t.field({
            type: 'ID',
            resolve(root: KyselyProject, _args, _ctx) {
                return root.project_id;
            },
        }),
        name: t.exposeString('name'),
        description: t.exposeString('description'),
        isArchived: t.exposeBoolean('is_archived'),
        dateCreated: t.field({
            type: 'String',
            resolve(root: KyselyProject, _args, _ctx) {
                return root.date_created.toISOString();
            },
        }),
        dateModified: t.field({
            type: 'String',
            resolve(root: KyselyProject, _args, _ctx) {
                return root.date_modified.toISOString();
            },
        }),
        createdBy: t.field({
            type: User,
            async resolve(root: KyselyProject, _args, _ctx) {
                const user = await db
                    .selectFrom('dstk_user.user')
                    .selectAll()
                    .where('dstk_user.user.user_id', '=', root.created_by_id)
                    .executeTakeFirstOrThrow();
                return user;
            },
        }),
        modifiedBy: t.field({
            type: User,
            async resolve(root: KyselyProject, _args, _ctx) {
                const user = await db
                    .selectFrom('dstk_user.user')
                    .selectAll()
                    .where('dstk_user.user.user_id', '=', root.modified_by_id)
                    .executeTakeFirstOrThrow();
                return user;
            },
        }),
    }),
});
