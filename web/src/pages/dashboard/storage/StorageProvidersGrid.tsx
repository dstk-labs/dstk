import type { StorageProvidersLoader } from "@/features/storage/loaders/storageProvidersLoader";
import { useReadQuery } from "@apollo/client";
import { SimpleGrid } from "@mantine/core";
import { CloudIcon } from "lucide-react";

import { EmptyState } from "@/components/emptyState/EmptyState";
import { IncludeArchivedSwitch } from "@/components/includeArchivedSwitch/IncludeArchivedSwitch";
import { LimitSelector } from "@/components/limitSelector/LimitSelector";
import { Pagination } from "@/components/pagination/Pagination";
import { SearchParamTextInput } from "@/components/searchParamInput/SearchParamInput";
import { TableCard } from "@/components/tableCard/TableCard";
import { useContinuationTokens } from "@/hooks/useContinuationTokens";

import { StorageProviderCard } from "./StorageProviderCard";

type StorageProvidersGridProps = {
  queryRef: StorageProvidersLoader;
};

export function StorageProvidersGrid({ queryRef }: StorageProvidersGridProps) {
  const { data } = useReadQuery(queryRef);
  const pageInfo = data.listStorageProviders?.pageInfo;
  const continuationTokens = useContinuationTokens(pageInfo?.continuationToken);

  const providers = (data.listStorageProviders?.edges ?? [])
    .map(edge => edge.node)
    .filter((provider): provider is NonNullable<typeof provider> => Boolean(provider));

  return (
    <>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-3)",
          justifyContent: "space-between",
          marginBottom: "var(--space-5)",
        }}
      >
        <SearchParamTextInput param="bucket" placeholder="Search by bucket…" />
        <IncludeArchivedSwitch />
      </div>

      {providers.length === 0
        ? (
            <TableCard>
              <EmptyState
                description="Connect an S3-compatible backend to start storing model artifacts."
                icon={<CloudIcon size={24} />}
                title="No storage providers"
              />
            </TableCard>
          )
        : (
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {providers.map(provider => (
                <StorageProviderCard key={provider.providerId} provider={provider} />
              ))}
            </SimpleGrid>
          )}

      <div
        style={{
          alignItems: "center",
          color: "var(--color-text-muted)",
          display: "flex",
          flexWrap: "wrap",
          fontSize: "var(--font-size-2xs)",
          gap: "var(--space-4)",
          justifyContent: "space-between",
          marginTop: "var(--space-5)",
        }}
      >
        <LimitSelector />
        <div style={{ display: "flex", gap: 4 }}>
          <Pagination
            continuationTokens={continuationTokens}
            hasNextPage={!!pageInfo?.hasNextPage}
            hasPreviousPage={!!pageInfo?.hasPreviousPage}
          />
        </div>
      </div>
    </>
  );
}
