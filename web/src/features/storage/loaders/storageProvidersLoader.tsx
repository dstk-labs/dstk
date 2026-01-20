import type { LoaderFunctionArgs } from "react-router";
import { z } from "zod/v4";

import { gql } from "@/graphql";
import { preloadQuery } from "@/lib/apollo";
import { ensureDefaultQueryParams } from "@/lib/ensureDefaultQueryParams";
import { parseQueryParams } from "@/lib/parseQueryParams";
import { useTeamStore } from "@/stores/teamStore";

export const LIST_STORAGE_PROVIDERS_FOR_TABLE = gql(`
  query ListStorageProvidersForTable(
    $teamId: String!
    $bucket: String
    $includeArchived: Boolean!
  ) {
    listStorageProviders(
      teamId: $teamId
      bucket: $bucket
      includeArchived: $includeArchived
    ) {
      accessKeyId
      bucket
      dateModified
      endpointUrl
      isArchived
      providerId
      region
    }
  }
`);

const storageProvidersLoaderSchema = z.object({
  bucket: z.string().optional(),
  includeArchived: z.string().transform(val => val === "true"),
});

export async function storageProvidersLoader({
  request,
}: LoaderFunctionArgs) {
  const { selectedTeam } = useTeamStore.getState();

  ensureDefaultQueryParams(request, {
    includeArchived: "false",
  });

  const { ...params } = parseQueryParams(request, storageProvidersLoaderSchema);

  return preloadQuery(LIST_STORAGE_PROVIDERS_FOR_TABLE, {
    variables: { teamId: selectedTeam!, ...params },
  }).toPromise();
}

export type StorageProvidersLoader = Awaited<
  ReturnType<typeof storageProvidersLoader>
>;
