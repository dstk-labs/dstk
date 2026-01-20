import { db } from "../db/kysely.js";
import { RegistryOperationError } from "./errors.js";

type UserHasRoleProps = {
  userId: string;
  teamId: string;
  roles: string[];
};

export async function userHasRole({ userId, teamId, roles }: UserHasRoleProps) {
  const results = await db
    .selectFrom("dstk_metadata.edge_relations")
    .select("dstk_metadata.edge_relations.type")
    .leftJoin(
      "dstk_user.team_edges",
      "dstk_user.team_edges.edge_type",
      "dstk_metadata.edge_relations.id",
    )
    .where(({ eb, and }) =>
      and([
        eb("dstk_user.team_edges.user_id", "=", userId),
        eb("dstk_user.team_edges.team_id", "=", teamId),
      ]),
    )
    .execute();

  const hasRole = roles.some(type => results.includes({ type }));

  if (!hasRole) {
    return new RegistryOperationError({ name: "TEAM_PERMISSION_ERROR" });
  }
}
