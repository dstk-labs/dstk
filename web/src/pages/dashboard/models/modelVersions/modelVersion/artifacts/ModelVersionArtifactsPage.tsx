import { Flex, Title } from '@mantine/core';
import { Suspense } from 'react';
import { useLoaderData, useParams } from 'react-router';

import { ModelVersionObjectsLoader } from '@/features/modelVersions/loaders/modelVersionObjectsLoader';

import { ModelVersionArtifactsDropzone } from './ModelVersionArtifactsDropzone';
import { ModelVersionArtifactsTable } from './ModelVersionArtifactsTable';

export const ModelVersionArtifactsPage = () => {
  const queryRef = useLoaderData() as ModelVersionObjectsLoader;
  const params = useParams();

  return (
    <>
      <Suspense>
        <Flex align='center' justify='space-between'>
          <Title order={4}>Files</Title>
          <ModelVersionArtifactsDropzone
            modelVersionId={params.modelVersionId ?? ''}
          />
        </Flex>
        <ModelVersionArtifactsTable queryRef={queryRef} />
      </Suspense>
    </>
  );
};
