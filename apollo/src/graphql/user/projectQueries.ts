import { Project } from './project.js';
import { builder } from '../../builder.js';
import { RegistryOperationError } from '../../utils/errors.js';
import { userHasRole } from '../../utils/rls.js';
import { db } from '../../db/kysely.js';
import type { Expression, SqlBool } from 'kysely';

builder.queryFields((t) => ({
    listProjects: t.field({
        type: [Project],
        authScopes: {
            loggedIn: true,
        },
        args: {
            includeArchived: t.arg.boolean({ required: true, defaultValue: false }),
            projectName: t.arg.string(),
            teamId: t.arg.string({ required: true }),
        },
        async resolve(_root, args, ctx) {
            await userHasRole({
                userId: ctx.user.user_id,
                teamId: args.teamId,
                roles: ['owner', 'member', 'viewer'],
            });

            const projects = await db
                .selectFrom('dstk_user.projects')
                .selectAll()
                .where((eb) => {
                    const statements: Expression<SqlBool>[] = [];

                    statements.push(eb(
                        'dstk_user.projects.team_id', '=', args.teamId,
                    ));

                    if (!args.includeArchived) {
                        statements.push(eb(
                            'dstk_user.projects.is_archived', 'is', false
                        ));
                    }

                    if (args.projectName) {
                        statements.push(eb(
                            'dstk_user.projects.name', 'ilike', `%${args.projectName}%`,
                        ))
                    }

                    return eb.and(statements)
                })
                .execute();

            return projects;
        },
    }),
    getProject: t.field({
        type: Project,
        authScopes: {
            loggedIn: true,
        },
        args: {
            projectId: t.arg.string({ required: true }),
        },
        async resolve(_root, args, ctx) {
            const project = await db
                .selectFrom('dstk_user.projects')
                .selectAll()
                .where('dstk_user.projects.project_id', '=', args.projectId)
                .executeTakeFirstOrThrow(
                    () => new RegistryOperationError({ name: 'PROJECT_PERMISSION_ERROR' }),
                );

            await userHasRole({
                userId: ctx.user.user_id,
                teamId: project.team_id,
                roles: ['owner', 'member', 'viewer'],
            });

            return project;
        },
    }),
}));
