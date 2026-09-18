import type { ProjectsLoader } from "@/features/projects/loaders/projectsLoader";
import { useReadQuery } from "@apollo/client";
import { Table } from "@mantine/core";
import { FolderIcon } from "lucide-react";

import { DateCell } from "@/components/dateCell/DateCell";
import { EmptyTableRow } from "@/components/emptyState/EmptyState";
import { IncludeArchivedSwitch } from "@/components/includeArchivedSwitch/IncludeArchivedSwitch";
import { LimitSelector } from "@/components/limitSelector/LimitSelector";
import { Pagination } from "@/components/pagination/Pagination";
import { RowActions } from "@/components/rowActions/RowActions";
import { SearchParamTextInput } from "@/components/searchParamInput/SearchParamInput";
import { ArchivableStatus } from "@/components/statusBadge/StatusBadge";
import { TableCard } from "@/components/tableCard/TableCard";
import { useContinuationTokens } from "@/hooks/useContinuationTokens";
import { truncate } from "@/utils/formatters";

import { ArchiveProject } from "./ArchiveProject";
import { EditProject } from "./EditProject";

type ProjectsTableProps = {
  queryRef: ProjectsLoader;
};

export function ProjectsTable({ queryRef }: ProjectsTableProps) {
  const { data } = useReadQuery(queryRef);
  const pageInfo = data.listProjects?.pageInfo;
  const continuationTokens = useContinuationTokens(pageInfo?.continuationToken);

  const projects = (data.listProjects?.edges ?? [])
    .map(edge => edge.node)
    .filter((project): project is NonNullable<typeof project> => Boolean(project));

  return (
    <TableCard>
      <TableCard.Toolbar
        end={<IncludeArchivedSwitch />}
        start={<SearchParamTextInput param="projectName" placeholder="Search projects…" />}
      />
      <TableCard.Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Project</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Created By</Table.Th>
            <Table.Th>Last Modified</Table.Th>
            <Table.Th aria-label="Actions" />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {projects.length === 0 && (
            <EmptyTableRow
              colSpan={6}
              description="Create a project to start organizing models."
              icon={<FolderIcon size={24} />}
              title="No projects yet"
            />
          )}
          {projects.map(project => (
            <Table.Tr key={project.projectId}>
              <Table.Td>{project.name}</Table.Td>
              <Table.Td title={project.description ?? undefined}>
                {truncate(project.description)}
              </Table.Td>
              <Table.Td>
                <ArchivableStatus isArchived={!!project.isArchived} />
              </Table.Td>
              <Table.Td>{project.createdBy?.realName ?? "—"}</Table.Td>
              <Table.Td>
                <DateCell value={project.dateModified} />
              </Table.Td>
              <Table.Td>
                <RowActions>
                  <EditProject
                    isArchived={!!project.isArchived}
                    originalDescription={project.description ?? ""}
                    originalName={project.name ?? ""}
                    projectId={project.projectId ?? ""}
                  />
                  <ArchiveProject
                    isArchived={!!project.isArchived}
                    projectId={project.projectId ?? ""}
                    projectName={project.name ?? ""}
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
