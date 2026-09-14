import type { LoaderFunctionArgs } from "react-router";
import { z } from "zod/v4";

import { ensureSelectedTeam } from "@/features/teams/lib/ensureSelectedTeam";
import { gql } from "@/graphql";
import { preloadQuery } from "@/lib/apollo";
import { ensureDefaultQueryParams } from "@/lib/ensureDefaultQueryParams";
import { parseQueryParams } from "@/lib/parseQueryParams";
import { limitSchema, useLimitStore } from "@/stores/limitStore";

export const LIST_STORAGE_PROVIDERS_FOR_TABLE = gql(`
  query ListStorageProvidersForTable(
    $after: String
    $bucket: String
    $first: Limit!
    $includeArchived: Boolean!
    $teamId: String!
  ) {
    listStorageProviders(
      after: $after
      bucket: $bucket
      first: $first
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
          accessKeyId
          bucket
          dateCreated
          dateModified
          endpointUrl
          isArchived
          providerId
          region
        }
      }
    }
  }
`);

const storageProvidersLoaderSchema = z.object({
  after: z.string().optional(),
  bucket: z.string().optional(),
  first: limitSchema,
  includeArchived: z.string().transform(val => val === "true"),
});

export async function storageProvidersLoader({
  request,
}: LoaderFunctionArgs) {
  const { limit } = useLimitStore.getState();

  ensureDefaultQueryParams(request, {
    first: limit.toString(),
    includeArchived: "false",
  });

  const params = parseQueryParams(request, storageProvidersLoaderSchema);

  const teamId = (await ensureSelectedTeam()) ?? "";

  return preloadQuery(LIST_STORAGE_PROVIDERS_FOR_TABLE, {
    fetchPolicy: "cache-and-network",
    variables: { teamId, ...params },
  }).toPromise();
}

export type StorageProvidersLoader = Awaited<
  ReturnType<typeof storageProvidersLoader>
>;
