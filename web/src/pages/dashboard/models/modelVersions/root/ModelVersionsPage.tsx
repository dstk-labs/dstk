import { useReadQuery } from '@apollo/client';
import { Badge, Button, Divider, Text, Title } from '@mantine/core';
import { Suspense } from 'react';
import { useLoaderData } from 'react-router';

import { IncludeArchivedSwitch } from '@/components/includeArchivedSwitch/IncludeArchivedSwitch';
import { SearchParamTextInput } from '@/components/searchParamInput/SearchParamInput';
import { ArchiveModel } from '@/features/models/components/ArchiveModel';
import { EditModel } from '@/features/models/components/EditModel';
import { ModelLoader } from '@/features/models/loaders/modelLoader';
import { ModelVersionsLoader } from '@/features/modelVersions/loaders/modelVersionsLoader';

import { AddModelVersion } from './AddModelVersion';
import styles from './ModelVersionsPage.module.css';
import { ModelVersionsTable } from './ModelVersionsTable';

export const ModelVersionsPage = () => {
  const [modelVersionsQueryRef, modelQueryRef] = useLoaderData() as (
    | ModelLoader
    | ModelVersionsLoader
  )[];

  const { data: parentModel } = useReadQuery(modelQueryRef);

  return (
    <>
      <header className={styles.modelHeader}>
        <div className={styles.modelAttributesContainer}>
          <div className={styles.modelStatusContainer}>
            <Title order={4}>{parentModel.getMLModel?.modelName}</Title>
            <Badge color={parentModel?.getMLModel?.isArchived ? 'red' : 'blue'}>
              {parentModel?.getMLModel?.isArchived ? 'Archived' : 'Active'}
            </Badge>
          </div>
          <Text c='dimmed' fw={500} size='sm'>
            {parentModel?.getMLModel?.description}
          </Text>
        </div>
        <div className={styles.modelActionsContainer}>
          <EditModel
            isArchived={!!parentModel?.getMLModel?.isArchived}
            modelId={parentModel?.getMLModel?.modelId ?? ''}
            originalDescription={parentModel?.getMLModel?.description ?? ''}
            originalModelName={parentModel?.getMLModel?.modelName ?? ''}
            originalProjectId={
              parentModel?.getMLModel?.project?.projectId ?? ''
            }
            originalStorageProviderId={
              parentModel?.getMLModel?.storageProvider?.providerId ?? ''
            }
            trigger={
              <Button
                color='gray'
                disabled={!!parentModel?.getMLModel?.isArchived}
                variant='light'
              >
                Edit
              </Button>
            }
          />
          <ArchiveModel
            isArchived={!!parentModel?.getMLModel?.isArchived}
            modelId={parentModel?.getMLModel?.modelId ?? ''}
            modelName={parentModel?.getMLModel?.modelName ?? ''}
            trigger={
              <Button
                color='red'
                disabled={!!parentModel?.getMLModel?.isArchived}
                variant='light'
              >
                Archive
              </Button>
            }
          />
        </div>
      </header>
      <Divider my='xl' />
      <header className={styles.header}>
        <div className={styles.searchContainer}>
          <SearchParamTextInput param='modelName' />
        </div>
        <div className={styles.toolbar}>
          <IncludeArchivedSwitch />
          <div className={styles.buttonContainer}>
            <AddModelVersion
              disabled={!!parentModel?.getMLModel?.isArchived}
              modelId={parentModel?.getMLModel?.modelId ?? ''}
            />
          </div>
        </div>
      </header>
      <Suspense>
        <ModelVersionsTable queryRef={modelVersionsQueryRef} />
      </Suspense>
    </>
  );
};
