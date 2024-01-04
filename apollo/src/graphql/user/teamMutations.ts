import { builder } from '../../builder.js';
import { ObjectionEdge } from '../misc/edges.js';
import { Team, ObjectionTeam, ObjectionTeamEdge, } from './team.js';


export const TeamInputType = builder.inputType('TeamInput', {
    fields: (t) => ({
        name: t.string({ required: true }),
        description: t.string({ required: true }),
    }),
});

builder.mutationFields((t) => ({
    createTeam: t.field({
        type: Team,
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
                        ownerId: ctx.user.$id(),
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
}));
