import { db } from "../db/kysely.js";
import { shishKebab } from "./string-functions.js";

type CreateTeam = {
  description: string;
  name: string;
  userId: string;
};

export async function createTeam({
  description,
  name,
  userId,
}: CreateTeam) {
  const results = await db.transaction().execute(async (trx) => {
    const team = await trx
      .insertInto("dstk_user.teams")
      .values({
        name,
        description,
        slug: shishKebab(name),
        is_archived: false,
        created_by_id: userId,
        modified_by_id: userId,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    await trx
      .insertInto("dstk_user.members")
      .values({
        team_id: team.id,
        user_id: userId,
        role: "owner",
      })
      .execute();

    return team;
  });
  return results;
}
