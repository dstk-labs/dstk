import { useReadQuery } from '@apollo/client';
import { Badge, Card, Flex, Table } from '@mantine/core';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { LimitSelector } from '@/components/limitSelector/LimitSelector';
import { NoResults } from '@/components/noResults/NoResults';
import { Pagination } from '@/components/pagination/Pagination';
import { paths } from '@/config/paths';
import { ModelVersionsLoader } from '@/features/modelVersions/loaders/modelVersionsLoader';

import { ArchiveModelVersion } from './ArchiveModelVersion';
import { EditModelVersion } from './EditModelVersion';
import styles from './ModelVersionsTable.module.css';

type ModelVersionsTableProps = {
  queryRef: ModelVersionsLoader;
};

export const ModelVersionsTable = ({ queryRef }: ModelVersionsTableProps) => {
  const { data } = useReadQuery(queryRef);

  const navigate = useNavigate();

  const [continuationTokens, setContinuationTokens] = useState<
    (null | string)[]
  >([null]);

  const continuationToken =
    data.listMLModelVersions?.pageInfo?.continuationToken ?? null;

  useEffect(() => {
    if (continuationToken && !continuationTokens.includes(continuationToken)) {
      setContinuationTokens((prev) => [...prev, continuationToken]);
    }
  }, [continuationToken, continuationTokens]);

  const rows =
    data.listMLModelVersions?.edges?.map((mlModelVersion) => (
      <Table.Tr
        className={styles.tableRow}
        key={mlModelVersion.node?.modelVersionId}
        onClick={() =>
          navigate(
            paths.dashboard.modelVersionCard.getPath(
              mlModelVersion.node?.modelId?.modelId ?? '',
              mlModelVersion.node?.modelVersionId ?? '',
            ),
          )
        }
      >
        <Table.Td>v{mlModelVersion.node?.numericVersion}</Table.Td>
        <Table.Td>
          {mlModelVersion.node?.description &&
          mlModelVersion.node?.description.length > 50
            ? `${mlModelVersion.node?.description.substring(0, 50)}...`
            : mlModelVersion.node?.description}
        </Table.Td>
        <Table.Td>
          <Badge
            className={styles.badge}
            color={
              mlModelVersion.node?.isArchived
                ? 'red'
                : mlModelVersion.node?.isFinalized
                  ? 'green'
                  : 'blue'
            }
          >
            {mlModelVersion.node?.isArchived
              ? 'Archived'
              : mlModelVersion.node?.isFinalized
                ? 'Deployed'
                : 'Pending'}
          </Badge>
        </Table.Td>
        <Table.Td>
          {dayjs(mlModelVersion.node?.dateCreated).format('YYYY-MM-DD')}
        </Table.Td>
        <Table.Td onClick={(e) => e.stopPropagation()}>
          <Flex gap={2}>
            <EditModelVersion
              isArchived={!!mlModelVersion.node?.isArchived}
              modelVersionId={mlModelVersion.node?.modelVersionId ?? ''}
              numericVersion={mlModelVersion.node?.numericVersion ?? 0}
              originalDescription={mlModelVersion.node?.description ?? ''}
            />
            <ArchiveModelVersion
              isArchived={!!mlModelVersion.node?.isArchived}
              modelVersionId={mlModelVersion.node?.modelVersionId ?? ''}
              numericVersion={mlModelVersion.node?.numericVersion ?? 0}
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
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Version Number</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Date Created</Table.Th>
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
          hasNextPage={!!data.listMLModelVersions?.pageInfo?.hasNextPage}
          hasPreviousPage={
            !!data.listMLModelVersions?.pageInfo?.hasPreviousPage
          }
        />
      </div>
    </div>
  );
};
