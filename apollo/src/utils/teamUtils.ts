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
      .insertInto("dstkUser.teams")
      .values({
        name,
        description,
        slug: shishKebab(name),
        isArchived: false,
        createdById: userId,
        modifiedById: userId,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    await trx
      .insertInto("dstkUser.members")
      .values({
        teamId: team.id,
        userId,
        role: "owner",
      })
      .execute();

    return team;
  });
  return results;
}
