import type { ModelsLoader } from "@/features/models/loaders/modelsLoader";
import { useReadQuery } from "@apollo/client";
import { Table } from "@mantine/core";
import { ArchiveIcon, BoxIcon, PencilIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { DateCell } from "@/components/dateCell/DateCell";
import { EmptyTableRow } from "@/components/emptyState/EmptyState";
import { IncludeArchivedSwitch } from "@/components/includeArchivedSwitch/IncludeArchivedSwitch";
import { LimitSelector } from "@/components/limitSelector/LimitSelector";
import { Pagination } from "@/components/pagination/Pagination";
import { RowAction, RowActions } from "@/components/rowActions/RowActions";
import { SearchParamTextInput } from "@/components/searchParamInput/SearchParamInput";
import { ArchivableStatus } from "@/components/statusBadge/StatusBadge";
import { TableCard } from "@/components/tableCard/TableCard";
import { VersionTag } from "@/components/versionTag/VersionTag";
import { paths } from "@/config/paths";
import { ArchiveModel } from "@/features/models/components/ArchiveModel";
import { EditModel } from "@/features/models/components/EditModel";
import { useContinuationTokens } from "@/hooks/useContinuationTokens";
import { truncate } from "@/utils/formatters";

import styles from "./ModelsTable.module.css";

type ModelsTableProps = {
  queryRef: ModelsLoader;
};

export function ModelsTable({ queryRef }: ModelsTableProps) {
  const { data } = useReadQuery(queryRef);
  const navigate = useNavigate();
  const pageInfo = data.listMLModels?.pageInfo;
  const continuationTokens = useContinuationTokens(pageInfo?.continuationToken);

  const models = (data.listMLModels?.edges ?? [])
    .map(edge => edge.node)
    .filter((model): model is NonNullable<typeof model> => Boolean(model));

  return (
    <TableCard>
      <TableCard.Toolbar
        end={<IncludeArchivedSwitch />}
        start={<SearchParamTextInput param="modelName" placeholder="Search models…" />}
      />
      <TableCard.Table minWidth={760}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Model</Table.Th>
            <Table.Th>Project</Table.Th>
            <Table.Th>Version</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Storage</Table.Th>
            <Table.Th>Updated</Table.Th>
            <Table.Th aria-label="Actions" />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {models.length === 0 && (
            <EmptyTableRow
              colSpan={7}
              description="Register a model to start tracking versions and artifacts."
              icon={<BoxIcon size={24} />}
              title="No models yet"
            />
          )}
          {models.map((model) => {
            const modelPath = paths.dashboard.model.getPath(model.modelId ?? "");
            return (
              <Table.Tr
                className={styles.row}
                key={model.modelId}
                onClick={() => navigate(modelPath)}
              >
                <Table.Td>
                  <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Link className={styles.name} to={modelPath}>
                      {model.modelName}
                    </Link>
                    <span
                      style={{
                        color: "var(--color-text-muted)",
                        fontSize: "var(--font-size-3xs)",
                        fontWeight: "var(--font-light)",
                      }}
                    >
                      {truncate(model.description, 48)}
                    </span>
                  </div>
                </Table.Td>
                <Table.Td>{model.project?.name ?? "—"}</Table.Td>
                <Table.Td>
                  {model.currentModelVersion?.numericVersion
                    ? <VersionTag version={model.currentModelVersion.numericVersion} />
                    : <span style={{ color: "var(--color-text-muted)" }}>—</span>}
                </Table.Td>
                <Table.Td>
                  <ArchivableStatus isArchived={!!model.isArchived} />
                </Table.Td>
                <Table.Td>
                  <code>{model.storageProvider?.bucket ?? "—"}</code>
                </Table.Td>
                <Table.Td>
                  <DateCell value={model.dateModified} />
                </Table.Td>
                <Table.Td>
                  <RowActions>
                    <EditModel
                      isArchived={!!model.isArchived}
                      modelId={model.modelId ?? ""}
                      originalDescription={model.description ?? ""}
                      originalModelName={model.modelName ?? ""}
                      originalProjectId={model.project?.projectId ?? ""}
                      originalStorageProviderId={model.storageProvider?.providerId ?? ""}
                      trigger={<RowAction icon={<PencilIcon size={14} />} label="Edit" />}
                    />
                    <ArchiveModel
                      isArchived={!!model.isArchived}
                      modelId={model.modelId ?? ""}
                      modelName={model.modelName ?? ""}
                      trigger={(
                        <RowAction danger icon={<ArchiveIcon size={14} />} label="Archive" />
                      )}
                    />
                  </RowActions>
                </Table.Td>
              </Table.Tr>
            );
          })}
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
