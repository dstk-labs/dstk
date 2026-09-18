import { LIST_TEAMS_FOR_DROPDOWN } from "@/features/teams/loaders/teamsLoader";
import { apolloClient } from "@/lib/apollo";
import { useTeamStore } from "@/stores/teamStore";

const PERSONAL_TEAM_NAME = "Personal Team";

export async function ensureSelectedTeam() {
  const { selectedTeam, setSelectedTeam } = useTeamStore.getState();

  const { data } = await apolloClient.query({ query: LIST_TEAMS_FOR_DROPDOWN });
  const teams = (data.listTeams?.edges ?? [])
    .map(edge => edge.node)
    .filter((team): team is NonNullable<typeof team> => Boolean(team?.teamId));

  if (teams.some(team => team.teamId === selectedTeam))
    return selectedTeam!;

  const fallback = teams.find(team => team.name === PERSONAL_TEAM_NAME) ?? teams[0];
  if (!fallback)
    return null;

  setSelectedTeam(fallback.teamId!);
  return fallback.teamId!;
}
