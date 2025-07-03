import { useReadQuery } from '@apollo/client';
import { Badge, Card, Flex, Table } from '@mantine/core';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';

import type { ProjectsLoader } from '@/features/projects/loaders/projectsLoader';

import { NoResults } from '@/components/noResults/NoResults';
import { paths } from '@/config/paths';

import { ArchiveProject } from './ArchiveProject';
import { EditProject } from './EditProject';
import styles from './ProjectsTable.module.css';

type ProjectsTableProps = {
  queryRef: ProjectsLoader;
};

export const ProjectsTable = ({ queryRef }: ProjectsTableProps) => {
  const { data } = useReadQuery(queryRef);

  const navigate = useNavigate();

  const rows =
    data.listProjects?.map((project) => (
      <Table.Tr
        className={styles.tableRow}
        key={project.projectId}
        onClick={() =>
          navigate(paths.dashboard.project.getPath(project.projectId ?? ''))
        }
      >
        <Table.Td>{project.name}</Table.Td>
        {/* TODO: Probably make this reusable */}
        <Table.Td>
          {project.description && project.description.length > 50
            ? `${project.description.substring(0, 50)}...`
            : project.description}
        </Table.Td>
        <Table.Td>
          <Badge
            className={styles.badge}
            color={project.isArchived ? 'red' : 'blue'}
          >
            {project.isArchived ? 'Archived' : 'Active'}
          </Badge>
        </Table.Td>
        <Table.Td>{dayjs(project.dateModified).format('YYYY-MM-DD')}</Table.Td>
        <Table.Td onClick={(e) => e.stopPropagation()}>
          <Flex gap={2}>
            <EditProject
              isArchived={!!project.isArchived}
              originalDescription={project.description ?? ''}
              originalName={project.name ?? ''}
              projectId={project.projectId ?? ''}
            />
            <ArchiveProject
              isArchived={!!project.isArchived}
              projectId={project.projectId ?? ''}
              projectName={project.name ?? ''}
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
