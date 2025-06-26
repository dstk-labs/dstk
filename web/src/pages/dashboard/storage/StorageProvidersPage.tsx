import { Suspense } from 'react';
import { useLoaderData } from 'react-router';

import type { StorageProvidersLoader } from '@/features/storage/loaders/storageProvidersLoader';

import { IncludeArchivedSwitch } from '@/components/includeArchivedSwitch/IncludeArchivedSwitch';
import { SearchParamTextInput } from '@/components/searchParamInput/SearchParamInput';

import { AddStorageProvider } from './AddStorageProvider';
import styles from './StorageProvidersPage.module.css';
import { StorageProvidersTable } from './StorageProvidersTable';

export const StorageProvidersPage = () => {
  const queryRef = useLoaderData() as StorageProvidersLoader;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.searchContainer}>
          <SearchParamTextInput param='bucket' />
        </div>
        <div className={styles.toolbar}>
          <IncludeArchivedSwitch />
          <div className={styles.buttonContainer}>
            <AddStorageProvider />
          </div>
        </div>
      </header>
      <Suspense>
        <StorageProvidersTable queryRef={queryRef} />
      </Suspense>
    </>
  );
};
