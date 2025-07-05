import { useReadQuery } from '@apollo/client';
import { Badge, Card, Flex, Table } from '@mantine/core';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';

import type { TeamsTableLoader } from '@/features/teams/loaders/teamsLoader';

import { NoResults } from '@/components/noResults/NoResults';
import { paths } from '@/config/paths';

import { ArchiveTeam } from './ArchiveTeam';
import { EditTeam } from './EditTeam';
import styles from './TeamsTable.module.css';

type TeamsTableProps = {
  queryRef: TeamsTableLoader;
};

export const TeamsTable = ({ queryRef }: TeamsTableProps) => {
  const { data } = useReadQuery(queryRef);

  const navigate = useNavigate();

  const rows =
    data.listTeams?.map((team) => (
      <Table.Tr
        className={styles.tableRow}
        key={team.teamId}
        onClick={() =>
          navigate(paths.dashboard.team.getPath(team.teamId ?? ''))
        }
      >
        <Table.Td>{team.name}</Table.Td>
        {/* TODO: Probably make this reusable */}
        <Table.Td>
          {team.description && team.description.length > 50
            ? `${team.description.substring(0, 50)}...`
            : team.description}
        </Table.Td>
        <Table.Td>
          <Badge
            className={styles.badge}
            color={team.isArchived ? 'red' : 'blue'}
          >
            {team.isArchived ? 'Archived' : 'Active'}
          </Badge>
        </Table.Td>
        <Table.Td>{dayjs(team.dateModified).format('YYYY-MM-DD')}</Table.Td>
        <Table.Td onClick={(e) => e.stopPropagation()}>
          <Flex gap={2}>
            <EditTeam
              isArchived={!!team.isArchived}
              originalDescription={team.description ?? ''}
              originalName={team.name ?? ''}
              teamId={team.teamId ?? ''}
            />
            <ArchiveTeam
              isArchived={!!team.isArchived}
              teamId={team.teamId ?? ''}
              teamName={team.name ?? ''}
            />
          </Flex>
        </Table.Td>
      </Table.Tr>
    )) ?? [];

  return (
    <div className={styles.tableContainer}>
      <Card bg='transparent' p={0} withBorder>
        <Table.ScrollContainer minWidth={500} type='native'>
          <Table highlightOnHover>
            <Table.Thead style={{ whiteSpace: 'nowrap' }}>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Last Modified</Table.Th>
                <Table.Th className='sr-only' />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? rows : <NoResults colSpan={5} />}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>
    </div>
  );
};
