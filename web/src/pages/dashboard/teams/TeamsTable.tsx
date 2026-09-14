import type { TeamsTableLoader } from "@/features/teams/loaders/teamsLoader";
import { useReadQuery } from "@apollo/client";
import { Table } from "@mantine/core";
import { UsersRoundIcon } from "lucide-react";
import { useNavigate } from "react-router";

import { DateCell } from "@/components/dateCell/DateCell";
import { EmptyTableRow } from "@/components/emptyState/EmptyState";
import { IncludeArchivedSwitch } from "@/components/includeArchivedSwitch/IncludeArchivedSwitch";
import { LimitSelector } from "@/components/limitSelector/LimitSelector";
import { Pagination } from "@/components/pagination/Pagination";
import { RowActions } from "@/components/rowActions/RowActions";
import { SearchParamTextInput } from "@/components/searchParamInput/SearchParamInput";
import { ArchivableStatus, StatusBadge } from "@/components/statusBadge/StatusBadge";
import { TableCard } from "@/components/tableCard/TableCard";
import { paths } from "@/config/paths";
import { useContinuationTokens } from "@/hooks/useContinuationTokens";
import { useTeamStore } from "@/stores/teamStore";
import { truncate } from "@/utils/formatters";

import { ArchiveTeam } from "./ArchiveTeam";
import { EditTeam } from "./EditTeam";
import styles from "./TeamsTable.module.css";

type TeamsTableProps = {
  queryRef: TeamsTableLoader;
};

export function TeamsTable({ queryRef }: TeamsTableProps) {
  const { data } = useReadQuery(queryRef);
  const navigate = useNavigate();
  const { selectedTeam } = useTeamStore();
  const pageInfo = data.listTeams?.pageInfo;
  const continuationTokens = useContinuationTokens(pageInfo?.continuationToken);

  const teams = (data.listTeams?.edges ?? [])
    .map(edge => edge.node)
    .filter((team): team is NonNullable<typeof team> => Boolean(team));

  return (
    <TableCard>
      <TableCard.Toolbar
        end={<IncludeArchivedSwitch />}
        start={<SearchParamTextInput param="teamName" placeholder="Search teams…" />}
      />
      <TableCard.Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Team</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Last Modified</Table.Th>
            <Table.Th aria-label="Actions" />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {teams.length === 0 && (
            <EmptyTableRow
              colSpan={5}
              description="Create a team to collaborate on models."
              icon={<UsersRoundIcon size={24} />}
              title="No teams found"
            />
          )}
          {teams.map(team => (
            <Table.Tr
              className={styles.row}
              key={team.teamId}
              onClick={() => navigate(paths.dashboard.team.getPath(team.teamId ?? ""))}
            >
              <Table.Td>
                <div style={{ alignItems: "center", display: "flex", gap: "var(--space-3)" }}>
                  <span>{team.name}</span>
                  {team.teamId === selectedTeam && (
                    <StatusBadge tone="sky">Current</StatusBadge>
                  )}
                </div>
              </Table.Td>
              <Table.Td title={team.description ?? undefined}>
                {truncate(team.description)}
              </Table.Td>
              <Table.Td>
                <ArchivableStatus isArchived={!!team.isArchived} />
              </Table.Td>
              <Table.Td>
                <DateCell value={team.dateModified} />
              </Table.Td>
              <Table.Td>
                <RowActions>
                  <EditTeam
                    isArchived={!!team.isArchived}
                    originalDescription={team.description ?? ""}
                    originalName={team.name ?? ""}
                    teamId={team.teamId ?? ""}
                  />
                  <ArchiveTeam
                    isArchived={!!team.isArchived}
                    teamId={team.teamId ?? ""}
                    teamName={team.name ?? ""}
                  />
                </RowActions>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </TableCard.Table>
      <TableCard.Footer
        end={(
          <Pagination
            continuationTokens={continuationTokens}
            hasNextPage={!!pageInfo?.hasNextPage}
            hasPreviousPage={!!pageInfo?.hasPreviousPage}
          />
        )}
        start={<LimitSelector />}
      />
    </TableCard>
  );
}
