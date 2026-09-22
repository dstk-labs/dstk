import type { GetStorageProviderQueryVariables } from "@/graphql/types";
import { gql } from "@/graphql";
import { preloadQuery } from "@/lib/apollo";

export const GET_STORAGE_PROVIDER = gql(`
  query GetStorageProvider($storageProviderId: String!) {
    getStorageProvider(storageProviderId: $storageProviderId) {
      accessKeyId
      bucket
      dateCreated
      dateModified
      endpointUrl
      isArchived
      providerId
      region
      createdBy {
        realName
      }
      modifiedBy {
        realName
      }
      owner {
        realName
      }
    }
  }
`);

export async function storageProviderLoader({
  storageProviderId,
}: GetStorageProviderQueryVariables) {
  return preloadQuery(GET_STORAGE_PROVIDER, {
    variables: { storageProviderId },
  }).toPromise();
}

export type StorageProviderLoader = Awaited<ReturnType<typeof storageProviderLoader>>;
