import { Suspense } from 'react';
import { useLoaderData } from 'react-router';

import type { ModelsLoader } from '@/features/models/loaders/modelsLoader';

import { IncludeArchivedSwitch } from '@/components/includeArchivedSwitch/IncludeArchivedSwitch';
import { SearchParamTextInput } from '@/components/searchParamInput/SearchParamInput';

import { AddModel } from './AddModel';
import styles from './ModelsPage.module.css';
import { ModelsTable } from './ModelsTable';

export const ModelsPage = () => {
  const queryRef = useLoaderData() as ModelsLoader;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.searchContainer}>
          <SearchParamTextInput param='modelName' />
        </div>
        <div className={styles.toolbar}>
          <IncludeArchivedSwitch />
          <div className={styles.buttonContainer}>
            <AddModel />
          </div>
        </div>
      </header>
      <Suspense>
        <ModelsTable queryRef={queryRef} />
      </Suspense>
    </>
  );
};
