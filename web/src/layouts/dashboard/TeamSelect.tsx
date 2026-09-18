import type { TeamsDropdownLoader } from "@/features/teams/loaders/teamsLoader";
import { useReadQuery } from "@apollo/client";
import { Menu, UnstyledButton } from "@mantine/core";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useEffect } from "react";
import { useRouteLoaderData } from "react-router";

import { InitialsAvatar } from "@/components/initialsAvatar/InitialsAvatar";
import { useTeamStore } from "@/stores/teamStore";

import styles from "./Sidebar.module.css";

const PERSONAL_TEAM_NAME = "Personal Team";

export function TeamSelect() {
  const queryRef = useRouteLoaderData("dashboard") as TeamsDropdownLoader;
  const { data } = useReadQuery(queryRef);

  const { selectedTeam, setSelectedTeam } = useTeamStore();

  const teams = (data.listTeams?.edges ?? [])
    .map(edge => edge.node)
    .filter((team): team is NonNullable<typeof team> => Boolean(team?.teamId));

  useEffect(() => {
    const hasValidSelection = teams.some(team => team.teamId === selectedTeam);
    if (hasValidSelection || teams.length === 0)
      return;

    const fallback
      = teams.find(team => team.name === PERSONAL_TEAM_NAME) ?? teams[0];
    setSelectedTeam(fallback.teamId!);
  }, [teams, selectedTeam, setSelectedTeam]);

  const activeTeam = teams.find(team => team.teamId === selectedTeam);
  const activeName = activeTeam?.name ?? "Select a team";

  return (
    <Menu position="bottom-start" width="target">
      <Menu.Target>
        <UnstyledButton className={styles.teamSelector}>
          <InitialsAvatar name={activeName} radius="sm" size={28} />
          <div
            style={{
              flex: 1,
              fontSize: "var(--font-size-xs)",
              fontWeight: "var(--font-regular)",
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {activeName}
          </div>
          <ChevronDownIcon className={styles.chevron} size={14} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Switch Team</Menu.Label>
        {teams.map(team => (
          <Menu.Item
            key={team.teamId}
            leftSection={<InitialsAvatar name={team.name ?? ""} radius="sm" size={20} />}
            onClick={() => setSelectedTeam(team.teamId!)}
            rightSection={
              team.teamId === selectedTeam
                ? <CheckIcon size={12} style={{ color: "var(--sky-300)" }} />
                : null
            }
          >
            {team.name}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
