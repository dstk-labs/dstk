import { Team, ObjectionTeam, ObjectionTeamEdge } from './team.js';
import { ObjectionUser, User } from './user.js';
import { builder } from '../../builder.js';

builder.queryFields((t) =>({
    listTeams: t.field({
        type: [Team],
        authScopes: {
            loggedIn: true,
        },
        args: {
            teamId: t.arg.string(),
        },
        async resolve(root, args, ctx) {
            const userTeamEdges = ObjectionTeamEdge.query()
                .where('userId', ctx.user.$id())
            if (args.teamId) {
                userTeamEdges.where('teamId', args.teamId);
            }

            const userTeams = await ObjectionTeamEdge.relatedQuery('team')
                .for(userTeamEdges) as [ObjectionTeam];
            return userTeams;
        }
    }),
    listTeamMembers: t.field({
        type: [User],
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

            const teamMembers = await ObjectionTeam.relatedQuery('teamMembers')
                .for(args.teamId) as [ObjectionUser];
            return teamMembers;
        }
    }),
}));