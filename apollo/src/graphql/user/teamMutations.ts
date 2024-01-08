import { builder } from '../../builder.js';
import { ObjectionEdge } from '../misc/edges.js';
import { Team, ObjectionTeam, ObjectionTeamEdge } from './team.js';


export const TeamInputType = builder.inputType('TeamInput', {
    fields: (t) => ({
        name: t.string({ required: true }),
        description: t.string({ required: true }),
    }),
});

export const UserRole = builder.enumType('UserRole', {
    values: [
        'owner',
        'member',
        'viewer',
    ] as const,
});

export const AddTeamMemberInputType = builder.inputType('AddTeamMemberInput', {
    fields: (t) => ({
        userId: t.string({ required: true }),
        teamId: t.string({ required: true }),
        role: t.field({
            required: true,
            type: UserRole,
        }),
    }),
});

builder.mutationFields((t) => ({
    createTeam: t.field({
        type: Team,
        authScopes: {
            loggedIn: true,
        },
        args: {
            data: t.arg({ type: TeamInputType, required: true }),
        },
        async resolve(root, args, ctx) {
            const results = ObjectionTeam.transaction(async (trx) => {
                const team = await ObjectionTeam.query(trx)
                    .insertAndFetch({
                        name: args.data.name,
                        description: args.data.description,
                        createdById: ctx.user.$id(),
                        modifiedById: ctx.user.$id(),
                    })
                    .first();

                const ownerEdgeType = await ObjectionEdge.query()
                    .where('type', 'owner')
                    .first() as ObjectionEdge;
                await ObjectionTeamEdge.query(trx)
                    .insert({
                        teamId: team.$id(),
                        userId: ctx.user.$id(),
                        edgeType: ownerEdgeType.id,
                    })
                    .returning('*');

                return team;
            });
            return results;
        },
    }),
    addToTeam: t.boolean({
        authScopes: {
            loggedIn: true,
        },
        args: {
            data: t.arg({ type: AddTeamMemberInputType, required: true }),
        },
        async resolve(root, args, ctx) {
            const results = ObjectionTeamEdge.transaction(async (trx) => {
                await ObjectionTeamEdge.userHasRole(
                    ctx.user.$id(),
                    args.data.teamId,
                    ['owner']
                );

                const targetUser = await ObjectionTeamEdge.query()
                    .where({
                        userId: args.data.userId,
                        teamId: args.data.teamId,
                    })
                    .first();
                const roleEdgeType = await ObjectionEdge.query()
                    .where({
                        type: args.data.role,
                    }).first() as ObjectionEdge;

                const upsertUserRole = ObjectionTeamEdge.query(trx);
                if (targetUser === undefined) {
                    upsertUserRole.insertAndFetch({
                        userId: args.data.userId,
                        teamId: args.data.teamId,
                        edgeType: roleEdgeType.id,
                    });
                } else {
                    upsertUserRole.patchAndFetchById(
                        targetUser.id,
                        { edgeType: roleEdgeType.id });
                }
                await upsertUserRole;

                return true;
            });
            return results;
        }
    }),
}));
