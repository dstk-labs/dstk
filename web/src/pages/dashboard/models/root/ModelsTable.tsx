import type { ModelsLoader } from "@/features/models/loaders/modelsLoader";
import { useReadQuery } from "@apollo/client";
import { ActionIcon, Badge, Card, Flex, Table, Tooltip } from "@mantine/core";
import dayjs from "dayjs";
import { ArchiveIcon, EditIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router";

import { LimitSelector } from "@/components/limitSelector/LimitSelector";
import { NoResults } from "@/components/noResults/NoResults";
import { Pagination } from "@/components/pagination/Pagination";
import { paths } from "@/config/paths";
import { ArchiveModel } from "@/features/models/components/ArchiveModel";
import { EditModel } from "@/features/models/components/EditModel";

import styles from "./ModelsTable.module.css";

type ModelsTableProps = {
  queryRef: ModelsLoader;
};

// TODO: Add Routes to Project and Storage Provider Page
export function ModelsTable({ queryRef }: ModelsTableProps) {
  const { data } = useReadQuery(queryRef);

  const navigate = useNavigate();

  const [continuationTokens, setContinuationTokens] = useState<
    (null | string)[]
  >([null]);

  const continuationToken
    = data.listMLModels?.pageInfo?.continuationToken ?? null;

  useEffect(() => {
    if (continuationToken && !continuationTokens.includes(continuationToken)) {
      setContinuationTokens(prev => [...prev, continuationToken]);
    }
  }, [continuationToken, continuationTokens]);

  const rows
    = data.listMLModels?.edges?.map(mlModel => (
      // TODO: Probably make this reusable
      <Table.Tr
        className={styles.tableRow}
        key={mlModel.node?.modelId}
        onClick={() =>
          navigate(paths.dashboard.model.getPath(mlModel.node?.modelId ?? ""))}
      >
        <Table.Td>{mlModel.node?.modelName}</Table.Td>
        <Table.Td>
          {mlModel.node?.description && mlModel.node?.description.length > 50
            ? `${mlModel.node?.description.substring(0, 50)}...`
            : mlModel.node?.description}
        </Table.Td>
        <Table.Td>
          v
          {mlModel.node?.currentModelVersion?.numericVersion ?? 0}
        </Table.Td>
        <Table.Td>
          <Badge
            className={styles.badge}
            color={mlModel.node?.isArchived ? "red" : "blue"}
          >
            {mlModel.node?.isArchived ? "Archived" : "Active"}
          </Badge>
        </Table.Td>
        <Table.Td>
          {dayjs(mlModel.node?.dateModified).format("YYYY-MM-DD")}
        </Table.Td>
        <Table.Td onClick={e => e.stopPropagation()}>
          <Flex gap={2}>
            <EditModel
              isArchived={!!mlModel.node?.isArchived}
              modelId={mlModel.node?.modelId ?? ""}
              originalDescription={mlModel.node?.description ?? ""}
              originalModelName={mlModel.node?.modelName ?? ""}
              originalProjectId={mlModel.node?.project?.projectId ?? ""}
              originalStorageProviderId={
                mlModel.node?.storageProvider?.providerId ?? ""
              }
              trigger={(
                <Tooltip disabled={!!mlModel.node?.isArchived} label="Edit">
                  <ActionIcon
                    color="blue"
                    disabled={!!mlModel.node?.isArchived}
                    variant="subtle"
                  >
                    <EditIcon size={14} />
                  </ActionIcon>
                </Tooltip>
              )}
            />
            <ArchiveModel
              isArchived={!!mlModel.node?.isArchived}
              modelId={mlModel.node?.modelId ?? ""}
              modelName={mlModel.node?.modelName ?? ""}
              trigger={(
                <Tooltip disabled={!!mlModel.node?.isArchived} label="Archive">
                  <ActionIcon
                    color="red"
                    disabled={!!mlModel.node?.isArchived}
                    variant="subtle"
                  >
                    <ArchiveIcon size={14} />
                  </ActionIcon>
                </Tooltip>
              )}
            />
          </Flex>
        </Table.Td>
      </Table.Tr>
    )) ?? [];

  return (
    <div className={styles.tableContainer}>
      <Card bg="transparent" p={0} withBorder>
        <Table.ScrollContainer minWidth={500} type="native">
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Model Name</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Current Version</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Last Modified</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length > 0 ? rows : <NoResults colSpan={5} />}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>
      <div className={styles.tableFooter}>
        <LimitSelector />
        <Pagination
          continuationTokens={continuationTokens}
          hasNextPage={!!data.listMLModels?.pageInfo?.hasNextPage}
          hasPreviousPage={!!data.listMLModels?.pageInfo?.hasPreviousPage}
        />
      </div>
    </div>
  );
}
