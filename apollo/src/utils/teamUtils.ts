import { db } from "../db/kysely.js";

type CreateTeam = {
    description: string;
    name: string;
    userId: string;
}

export const createTeam = async ({
    description,
    name,
    userId,
}: CreateTeam) => {
    const results = await db.transaction().execute(async (trx) => {
        const team = await trx
            .insertInto('dstk_user.teams')
            .values({
                name,
                description,
                created_by_id: userId,
                modified_by_id: userId,
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
                user_id: userId,
                edge_type: ownerEdgeType.id,
            })
            .execute();

        return team;
    });
    return results;
};
