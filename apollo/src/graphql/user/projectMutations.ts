import { builder } from '../../builder.js';
import { Project, ObjectionProject } from './project.js';
import { ObjectionTeamEdge } from './team.js';
import { RegistryOperationError } from '../../utils/errors.js';
import { raw } from 'objection';

export const ProjectInputType = builder.inputType('ProjectInput', {
    fields: (t) => ({
        name: t.string({ required: true }),
        description: t.string({ required: true }),
        teamId: t.string({ required: true }),
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
        async resolve(root, args, ctx) {
            const results = ObjectionProject.transaction(async (trx) => {
                await ObjectionTeamEdge.userHasRole(
                    ctx.user.$id(),
                    args.data.teamId,
                    ['owner', 'member']
                );

                const project = await ObjectionProject.query(trx)
                    .insertAndFetch({
                        name: args.data.name,
                        description: args.data.description,
                        createdById: ctx.user.$id(),
                        modifiedById: ctx.user.$id(),
                        teamId: args.data.teamId,
                    })
                    .first();

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
        async resolve(root, args, ctx) {
            const results = ObjectionProject.transaction(async (trx) => {
                const project = await ObjectionProject.query()
                    .for(args.projectId)
                    .first();
                if (project === undefined) {
                    throw new RegistryOperationError({ name: 'PROJECT_PERMISSION_ERROR' });
                }

                await ObjectionTeamEdge.userHasRole(
                    ctx.user.$id(),
                    project.teamId,
                    ['owner', 'member']
                );

                await project.$query(trx)
                    .updateAndFetch({
                        modifiedById: ctx.user.$id(),
                        dateModified: raw('NOW()'),
                        isArchived: raw('NOT is_archived'),
                    });

                return project;
            });
            return results;
        }
    })
}));
