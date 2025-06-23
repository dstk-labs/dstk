import { builder } from '../../builder.js';
import { Project } from './project.js';
import { RegistryOperationError } from '../../utils/errors.js';
import { db } from '../../db/kysely.js';
import { userHasRole } from '../../utils/rls.js';

export const ProjectInputType = builder.inputType('ProjectInput', {
    fields: (t) => ({
        name: t.string({ required: true }),
        description: t.string({ required: true }),
        teamId: t.string({ required: true }),
    }),
});

export const EditProjectInputType = builder.inputType('EditProjectInput', {
    fields: (t) => ({
        name: t.string({ required: true }),
        description: t.string({ required: true }),
        projectId: t.string({ required: true }),
    }),
});

builder.mutationFields((t) => ({
    createProject: t.field({
        type: Project,
        authScopes: {
            loggedIn: true,
        },
        args: {
            data: t.arg({ type: ProjectInputType, required: true }),
        },
        async resolve(_root, args, ctx) {
            const results = await db.transaction().execute(async (trx) => {
                await userHasRole({
                    userId: ctx.user.user_id,
                    teamId: args.data.teamId,
                    roles: ['owner', 'member'],
                });

                const project = await trx
                    .insertInto('dstk_user.projects')
                    .values({
                        name: args.data.name,
                        description: args.data.description,
                        created_by_id: ctx.user.user_id,
                        modified_by_id: ctx.user.user_id,
                        team_id: args.data.teamId,
                    })
                    .returningAll()
                    .executeTakeFirstOrThrow();

                return project;
            });
            return results;
        },
    }),
    archiveProject: t.field({
        type: Project,
        authScopes: {
            loggedIn: true,
        },
        args: {
            projectId: t.arg.string({ required: true }),
        },
        async resolve(_root, args, ctx) {
            const results = await db.transaction().execute(async (trx) => {
                const project = await trx
                    .selectFrom('dstk_user.projects')
                    .select(['dstk_user.projects.team_id', 'dstk_user.projects.is_archived'])
                    .where('dstk_user.projects.project_id', '=', args.projectId)
                    .executeTakeFirstOrThrow(
                        () => new RegistryOperationError({ name: 'PROJECT_PERMISSION_ERROR' }),
                    );

                await userHasRole({
                    userId: ctx.user.user_id,
                    teamId: project.team_id,
                    roles: ['owner', 'member'],
                });

                const result = await trx
                    .updateTable('dstk_user.projects')
                    .set({
                        modified_by_id: ctx.user.user_id,
                        date_modified: new Date(),
                        is_archived: !project.is_archived,
                    })
                    .where('dstk_user.projects.project_id', '=', args.projectId)
                    .returningAll()
                    .executeTakeFirstOrThrow();

                return result;
            });
            return results;
        },
    }),
    editProject: t.field({
        type: Project,
        authScopes: {
            loggedIn: true,
        },
        args: {
            data: t.arg({ type: EditProjectInputType, required: true }),
        },
        async resolve(_root, args, ctx) {
            const results = await db.transaction().execute(async (trx) => {
                const project = await trx
                    .selectFrom('dstk_user.projects')
                    .select(['dstk_user.projects.team_id', 'dstk_user.projects.is_archived'])
                    .where('dstk_user.projects.project_id', '=', args.data.projectId)
                    .executeTakeFirstOrThrow(
                        () => new RegistryOperationError({ name: 'PROJECT_PERMISSION_ERROR' }),
                    );

                await userHasRole({
                    userId: ctx.user.user_id,
                    teamId: project.team_id,
                    roles: ['owner', 'member'],
                });

                if (project.is_archived) {
                    new RegistryOperationError({ name: 'ARCHIVED_PROJECT_ERROR' });
                }

                const result = await trx
                    .updateTable('dstk_user.projects')
                    .set({
                        description: args.data.description,
                        name: args.data.name,
                    })
                    .where('dstk_user.projects.project_id', '=', args.data.projectId)
                    .returningAll()
                    .executeTakeFirstOrThrow();

                return result;
            });
        return results;
        }
    })
}));
