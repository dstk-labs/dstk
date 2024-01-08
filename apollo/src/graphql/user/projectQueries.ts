import { Project, ObjectionProject } from './project.js';
import { ObjectionTeam, ObjectionTeamEdge } from './team.js';
import { builder } from '../../builder.js';
import { RegistryOperationError } from '../../utils/errors.js';

builder.queryFields((t) =>({
    listProjects: t.field({
        type: [Project],
        authScopes: {
            loggedIn: true,
        },
        args: {
            teamId: t.arg.string({ required: true }),
        },
        async resolve(root, args, ctx) {
            await ObjectionTeamEdge.userHasRole(
                ctx.user.$id(),
                args.teamId,
                ['owner', 'member', 'viewer']
            );

            const projects = await ObjectionTeam.relatedQuery('projects')
                .for(args.teamId) as [ObjectionProject];
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
        async resolve(root, args, ctx) {
            const project = await ObjectionProject.query()
                .for(args.projectId)
                .first();
            if (project === undefined) {
                throw new RegistryOperationError({ name: 'PROJECT_PERMISSION_ERROR' });
            }
            
            await ObjectionTeamEdge.userHasRole(
                ctx.user.$id(),
                project.teamId,
                ['owner', 'member', 'viewer']
            );

            return project;
        },
    })
}));