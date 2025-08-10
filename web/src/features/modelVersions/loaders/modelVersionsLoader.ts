import { type LoaderFunctionArgs } from 'react-router';
import { z } from 'zod/v4';

import { gql } from '@/graphql';
import { preloadQuery } from '@/lib/apollo';
import { ensureDefaultQueryParams } from '@/lib/ensureDefaultQueryParams';
import { parseQueryParams } from '@/lib/parseQueryParams';
import { limitSchema, useLimitStore } from '@/stores/limitStore';

export const LIST_MODEL_VERSIONS = gql(`
  query ListMLModelVersions(
    $modelId: String!
    $after: String
    $first: Limit!
    $includeArchived: Boolean!
  ) {
    listMLModelVersions(
      modelId: $modelId
      after: $after
      first: $first
      includeArchived: $includeArchived
    ) {
      pageInfo {
        continuationToken
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          modelVersionId
          modelId {
            description
            isArchived
            modelName
            modelId
          }
          numericVersion
          isArchived
          isFinalized
          description
          dateCreated
        }
      }
    }
  }
`);

const modelVersionsSchema = z.object({
  after: z.string().optional(),
  first: limitSchema,
  includeArchived: z.string().transform((val) => val === 'true'),
});

export const modelVersionsLoader = async ({
  params,
  request,
}: LoaderFunctionArgs) => {
  const { limit } = useLimitStore.getState();

  ensureDefaultQueryParams(request, {
    first: limit.toString(),
    includeArchived: 'false',
  });

  const { after, first, includeArchived } = parseQueryParams(
    request,
    modelVersionsSchema,
  );

  return preloadQuery(LIST_MODEL_VERSIONS, {
    variables: {
      after,
      first,
      includeArchived,
      modelId: params.modelId!,
    },
  }).toPromise();
};

export type ModelVersionsLoader = Awaited<
  ReturnType<typeof modelVersionsLoader>
>;
