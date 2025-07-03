import { type LoaderFunctionArgs, redirect } from 'react-router';
import { z } from 'zod/v4';

import { gql } from '@/graphql';
import { preloadQuery } from '@/lib/apollo';
import { parseQueryParams } from '@/lib/parseQueryParams';
import { limitSchema, useLimitStore } from '@/stores/limitStore';
import { useTeamStore } from '@/stores/teamStore';

export const LIST_MODELS = gql(`
  query ListMLModels(
    $after: String
    $first: Limit!
    $modelName: String
    $includeArchived: Boolean!
    $teamId: String!
  ) {
    listMLModels(
      after: $after
      first: $first
      modelName: $modelName
      includeArchived: $includeArchived
      teamId: $teamId
    ) {
      pageInfo {
        continuationToken
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          currentModelVersion {
            numericVersion
          }
          dateModified
          description
          isArchived
          modelId
          modelName
          project {
            projectId
          }
          storageProvider {
            providerId
          }
        }
      }
    }
  }
`);

const modelsLoaderSchema = z.object({
  after: z.string().optional(),
  bucket: z.string().optional(),
  first: limitSchema,
  includeArchived: z.string().transform((val) => val === 'true'),
  modelName: z.string().optional(),
});

export const modelsLoader = async ({ request }: LoaderFunctionArgs) => {
  const { selectedTeam } = useTeamStore.getState();
  const { limit } = useLimitStore.getState();

  const url = new URL(request.url);
  let shouldModifyUrl = false;

  if (!url.searchParams.has('includeArchived')) {
    url.searchParams.set('includeArchived', 'false');
    shouldModifyUrl = true;
  }

  if (!url.searchParams.has('first')) {
    url.searchParams.set('first', limit.toString());
    shouldModifyUrl = true;
  }

  if (shouldModifyUrl) {
    throw redirect(url.toString());
  }

  const { ...params } = parseQueryParams(request, modelsLoaderSchema);

  return preloadQuery(LIST_MODELS, {
    variables: { teamId: selectedTeam!, ...params },
  }).toPromise();
};

export type ModelsLoader = Awaited<ReturnType<typeof modelsLoader>>;
