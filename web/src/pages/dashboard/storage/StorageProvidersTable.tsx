import { useReadQuery } from '@apollo/client';
import { Badge, Card, Flex, Table } from '@mantine/core';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';

import type { StorageProvidersLoader } from '@/features/storage/loaders/storageProvidersLoader';

import { NoResults } from '@/components/noResults/NoResults';
import { paths } from '@/config/paths';

import { ArchiveStorageProvider } from './ArchiveStorageProvider';
import { EditStorageProvider } from './EditStorageProvider';
import styles from './StorageProvidersTable.module.css';

type StorageProvidersTableProps = {
  queryRef: StorageProvidersLoader;
};

export const StorageProvidersTable = ({
  queryRef,
}: StorageProvidersTableProps) => {
  const { data } = useReadQuery(queryRef);

  const navigate = useNavigate();

  const rows =
    data.listStorageProviders?.map((storageProvider) => (
      <Table.Tr
        className={styles.tableRow}
        key={storageProvider.providerId}
        onClick={() =>
          navigate(
            paths.dashboard.storageItem.getPath(
              storageProvider.providerId ?? '',
            ),
          )
        }
      >
        <Table.Td>{storageProvider.bucket}</Table.Td>
        <Table.Td>{storageProvider.region}</Table.Td>
        <Table.Td>{storageProvider.endpointUrl}</Table.Td>
        <Table.Td>
          <Badge color={storageProvider.isArchived ? 'red' : 'blue'}>
            {storageProvider.isArchived ? 'Archived' : 'Active'}
          </Badge>
        </Table.Td>
        <Table.Td>
          {dayjs(storageProvider.dateModified).format('YYYY-MM-DD')}
        </Table.Td>
        <Table.Td onClick={(e) => e.stopPropagation()}>
          <Flex gap={2}>
            <EditStorageProvider
              bucket={storageProvider.bucket ?? ''}
              isArchived={!!storageProvider.isArchived}
              originalAccessKeyId={storageProvider.accessKeyId ?? ''}
              providerId={storageProvider.providerId ?? ''}
            />
            <ArchiveStorageProvider
              bucket={storageProvider.bucket ?? ''}
              isArchived={!!storageProvider.isArchived}
              providerId={storageProvider.providerId ?? ''}
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
                <Table.Th>Bucket Name</Table.Th>
                <Table.Th>Region</Table.Th>
                <Table.Th>Endpoint</Table.Th>
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
    </div>
  );
};
