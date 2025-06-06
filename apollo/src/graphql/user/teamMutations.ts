import { builder } from '../../builder.js';
import { db } from '../../db/kysely.js';
import { RegistryOperationError } from '../../utils/errors.js';
import { userHasRole } from '../../utils/rls.js';
import { Team } from './team.js';

export const TeamInputType = builder.inputType('TeamInput', {
    fields: (t) => ({
        name: t.string({ required: true }),
        description: t.string({ required: true }),
    }),
});

export const UserRole = builder.enumType('UserRole', {
    values: ['owner', 'member', 'viewer'] as const,
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
        async resolve(_root, args, ctx) {
            const results = await db.transaction().execute(async (trx) => {
                const team = await trx
                    .insertInto('dstk_user.teams')
                    .values({
                        name: args.data.name,
                        description: args.data.description,
                        created_by_id: ctx.user.user_id,
                        modified_by_id: ctx.user.user_id,
                    })
                    .returningAll()
                    .executeTakeFirstOrThrow();

                const ownerEdgeType = await trx
                    .selectFrom('dstk_metadata.edge_relations')
                    .select('dstk_metadata.edge_relations.id')
                    .where('dstk_metadata.edge_relations.type', '=', 'owner')
                    .executeTakeFirstOrThrow();

                await trx
                    .insertInto('dstk_user.team_edges')
                    .values({
                        team_id: team.team_id,
                        user_id: ctx.user.user_id,
                        edge_type: ownerEdgeType.id,
                    })
                    .execute();

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
        async resolve(_root, args, ctx) {
            const results = await db.transaction().execute(async (trx) => {
                await userHasRole({
                    userId: ctx.user.user_id,
                    teamId: args.data.teamId,
                    roles: ['owner'],
                });

                const targetUser = await trx
                    .selectFrom('dstk_user.team_edges')
                    .select('dstk_user.team_edges.id')
                    .where(({ eb, and }) =>
                        and([
                            eb('dstk_user.team_edges.user_id', '=', args.data.userId),
                            eb('dstk_user.team_edges.team_id', '=', args.data.teamId),
                        ]),
                    )
                    .executeTakeFirst();

                const roleEdgeType = await trx
                    .selectFrom('dstk_metadata.edge_relations')
                    .select('dstk_metadata.edge_relations.id')
                    .where('dstk_metadata.edge_relations.type', '=', args.data.role)
                    .executeTakeFirstOrThrow(
                        () => new RegistryOperationError({ name: 'ROLE_NOT_FOUND_ERROR' }),
                    );

                if (targetUser === undefined) {
                    await trx
                        .insertInto('dstk_user.team_edges')
                        .values({
                            user_id: args.data.userId,
                            team_id: args.data.teamId,
                            edge_type: roleEdgeType.id,
                        })
                        .execute();
                } else {
                    await trx
                        .updateTable('dstk_user.team_edges')
                        .set({
                            edge_type: roleEdgeType.id,
                        })
                        .where('dstk_user.team_edges.id', '=', targetUser.id)
                        .execute();
                }
                return true;
            });
            return results;
        },
    }),
}));
