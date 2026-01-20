import type { LoaderFunctionArgs } from "react-router";
import { z } from "zod/v4";

import { gql } from "@/graphql";
import { preloadQuery } from "@/lib/apollo";
import { ensureDefaultQueryParams } from "@/lib/ensureDefaultQueryParams";
import { parseQueryParams } from "@/lib/parseQueryParams";
import { limitSchema, useLimitStore } from "@/stores/limitStore";

export const LIST_OBJECTS_FOR_MODEL_VERSION = gql(`
  query ListObjectsForModelVersion(
    $modelVersionId: String!
    $after: String
    $first: Limit!
    $prefix: String
  ) {
    listObjectsForModelVersion(
      modelVersionId: $modelVersionId
      after: $after
      first: $first
      prefix: $prefix
    ) {
      pageInfo {
        continuationToken
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          lastModified
          name
          size
        }
      }
    }
  }
`);

const listObjectsForModelVersionSchema = z.object({
  after: z.string().optional(),
  first: limitSchema,
  prefix: z.string().optional(),
});

export async function modelVersionObjectsLoader({
  params,
  request,
}: LoaderFunctionArgs) {
  const { limit } = useLimitStore.getState();

  ensureDefaultQueryParams(request, {
    first: limit.toString(),
  });

  const { after, first, prefix } = parseQueryParams(
    request,
    listObjectsForModelVersionSchema,
  );

  return preloadQuery(LIST_OBJECTS_FOR_MODEL_VERSION, {
    variables: {
      after,
      first,
      modelVersionId: params.modelVersionId!,
      prefix,
    },
  }).toPromise();
}

export type ModelVersionObjectsLoader = Awaited<
  ReturnType<typeof modelVersionObjectsLoader>
>;
