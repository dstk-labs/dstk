import type { ReactNode } from "react";
import type { ModelVersionObjectsLoader } from "@/features/modelVersions/loaders/modelVersionObjectsLoader";
import { useReadQuery } from "@apollo/client";
import { Table } from "@mantine/core";
import { FileIcon, FileTextIcon } from "lucide-react";

import { DateCell } from "@/components/dateCell/DateCell";
import { EmptyTableRow } from "@/components/emptyState/EmptyState";
import { LimitSelector } from "@/components/limitSelector/LimitSelector";
import { Pagination } from "@/components/pagination/Pagination";
import { TableCard } from "@/components/tableCard/TableCard";
import { useContinuationTokens } from "@/hooks/useContinuationTokens";
import { formatFileSize } from "@/utils/formatters";

type ModelVersionArtifactsTableProps = {
  actions: ReactNode;
  queryRef: ModelVersionObjectsLoader;
};

export function ModelVersionArtifactsTable({
  actions,
  queryRef,
}: ModelVersionArtifactsTableProps) {
  const { data } = useReadQuery(queryRef);
  const pageInfo = data.listObjectsForModelVersion?.pageInfo;
  const continuationTokens = useContinuationTokens(pageInfo?.continuationToken);

  const objects = (data.listObjectsForModelVersion?.edges ?? [])
    .map(edge => edge.node)
    .filter((object): object is NonNullable<typeof object> => Boolean(object));

  const totalSize = objects.reduce((sum, object) => sum + (object.size ?? 0), 0);

  return (
    <TableCard>
      <TableCard.Toolbar
        end={actions}
        start={(
          <span style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-regular)" }}>
            Files
          </span>
        )}
      />
      <TableCard.Table minWidth={520}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th style={{ textAlign: "right" }}>Size</Table.Th>
            <Table.Th>Last Modified</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {objects.length === 0 && (
            <EmptyTableRow
              colSpan={3}
              description="Upload model weights, configs, and evaluation results for this version."
              icon={<FileTextIcon size={24} />}
              title="No files yet"
            />
          )}
          {objects.map(object => (
            <Table.Tr key={object.name}>
              <Table.Td>
                <div style={{ alignItems: "center", display: "flex", gap: "var(--space-3)" }}>
                  <FileIcon size={16} style={{ color: "var(--color-text-muted)" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--font-size-xs)" }}>
                    {object.name}
                  </span>
                </div>
              </Table.Td>
              <Table.Td style={{ textAlign: "right" }}>
                {formatFileSize(object.size ?? 0)}
              </Table.Td>
              <Table.Td>
                <DateCell value={object.lastModified} />
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
        start={(
          <>
            <LimitSelector />
            <span>
              {objects.length}
              {" "}
              {objects.length === 1 ? "file" : "files"}
              {" · "}
              {formatFileSize(totalSize)}
              {" "}
              on this page
            </span>
          </>
        )}
      />
    </TableCard>
  );
}
