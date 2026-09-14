import type { ModelVersionsLoader } from "@/features/modelVersions/loaders/modelVersionsLoader";
import { useReadQuery } from "@apollo/client";
import { Table } from "@mantine/core";
import { LayersIcon } from "lucide-react";
import { useNavigate } from "react-router";

import { DateCell } from "@/components/dateCell/DateCell";
import { EmptyTableRow } from "@/components/emptyState/EmptyState";
import { IncludeArchivedSwitch } from "@/components/includeArchivedSwitch/IncludeArchivedSwitch";
import { LimitSelector } from "@/components/limitSelector/LimitSelector";
import { Pagination } from "@/components/pagination/Pagination";
import { RowActions } from "@/components/rowActions/RowActions";
import { ModelVersionStatus } from "@/components/statusBadge/StatusBadge";
import { TableCard } from "@/components/tableCard/TableCard";
import { VersionTag } from "@/components/versionTag/VersionTag";
import { paths } from "@/config/paths";
import { useContinuationTokens } from "@/hooks/useContinuationTokens";
import { truncate } from "@/utils/formatters";

import { ArchiveModelVersion } from "./ArchiveModelVersion";
import { EditModelVersion } from "./EditModelVersion";
import styles from "./ModelVersionsTable.module.css";

type ModelVersionsTableProps = {
  queryRef: ModelVersionsLoader;
};

export function ModelVersionsTable({ queryRef }: ModelVersionsTableProps) {
  const { data } = useReadQuery(queryRef);
  const navigate = useNavigate();
  const pageInfo = data.listMLModelVersions?.pageInfo;
  const continuationTokens = useContinuationTokens(pageInfo?.continuationToken);

  const versions = (data.listMLModelVersions?.edges ?? [])
    .map(edge => edge.node)
    .filter((version): version is NonNullable<typeof version> => Boolean(version));

  return (
    <TableCard>
      <TableCard.Toolbar
        end={<IncludeArchivedSwitch />}
        start={(
          <span style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-regular)" }}>
            Versions
          </span>
        )}
      />
      <TableCard.Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Version</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Created By</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th aria-label="Actions" />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {versions.length === 0 && (
            <EmptyTableRow
              colSpan={6}
              description="Push a version to start uploading artifacts."
              icon={<LayersIcon size={24} />}
              title="No versions yet"
            />
          )}
          {versions.map(version => (
            <Table.Tr
              className={styles.row}
              key={version.modelVersionId}
              onClick={() =>
                navigate(
                  paths.dashboard.modelVersionCard.getPath(
                    version.modelId?.modelId ?? "",
                    version.modelVersionId ?? "",
                  ),
                )}
            >
              <Table.Td>
                <VersionTag version={version.numericVersion ?? 0} />
              </Table.Td>
              <Table.Td title={version.description ?? undefined}>
                {truncate(version.description)}
              </Table.Td>
              <Table.Td>
                <ModelVersionStatus
                  isArchived={!!version.isArchived}
                  isFinalized={!!version.isFinalized}
                />
              </Table.Td>
              <Table.Td>{version.createdBy?.realName ?? "—"}</Table.Td>
              <Table.Td>
                <DateCell value={version.dateCreated} />
              </Table.Td>
              <Table.Td>
                <RowActions>
                  <EditModelVersion
                    isArchived={!!version.isArchived}
                    modelVersionId={version.modelVersionId ?? ""}
                    numericVersion={version.numericVersion ?? 0}
                    originalDescription={version.description ?? ""}
                  />
                  <ArchiveModelVersion
                    isArchived={!!version.isArchived}
                    modelVersionId={version.modelVersionId ?? ""}
                    numericVersion={version.numericVersion ?? 0}
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
