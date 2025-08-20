import { useReadQuery } from '@apollo/client';
import { Card, Table } from '@mantine/core';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import type { ModelVersionObjectsLoader } from '@/features/modelVersions/loaders/modelVersionObjectsLoader';

import { LimitSelector } from '@/components/limitSelector/LimitSelector';
import { NoResults } from '@/components/noResults/NoResults';
import { Pagination } from '@/components/pagination/Pagination';

import styles from './ModelVersionArtifactsTable.module.css';

type ModelVersionArtifactsTableProps = {
  queryRef: ModelVersionObjectsLoader;
};

export const ModelVersionArtifactsTable = ({
  queryRef,
}: ModelVersionArtifactsTableProps) => {
  const { data } = useReadQuery(queryRef);

  const [continuationTokens, setContinuationTokens] = useState<
    (null | string)[]
  >([null]);

  const continuationToken =
    data.listObjectsForModelVersion?.pageInfo?.continuationToken ?? null;

  useEffect(() => {
    if (continuationToken && !continuationTokens.includes(continuationToken)) {
      setContinuationTokens((prev) => [...prev, continuationToken]);
    }
  }, [continuationToken, continuationTokens]);

  const rows =
    data.listObjectsForModelVersion?.edges?.map((object) => (
      <Table.Tr className={styles.tableRow} key={object.node?.name}>
        <Table.Td>{object.node?.name}</Table.Td>
        <Table.Td align='right'>{object.node?.size}</Table.Td>
        <Table.Td>
          {dayjs(object.node?.lastModified).format('YYYY-MM-DD')}
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
                <Table.Th>Name</Table.Th>
                <Table.Th align='right'>Size</Table.Th>
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
          hasNextPage={!!data.listObjectsForModelVersion?.pageInfo?.hasNextPage}
          hasPreviousPage={
            !!data.listObjectsForModelVersion?.pageInfo?.hasPreviousPage
          }
        />
      </div>
    </div>
  );
};
