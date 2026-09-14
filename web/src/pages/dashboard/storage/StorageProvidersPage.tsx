import type { StorageProvidersLoader } from "@/features/storage/loaders/storageProvidersLoader";
import { Suspense } from "react";
import { useLoaderData } from "react-router";

import { PageHeader } from "@/components/pageHeader/PageHeader";

import { AddStorageProvider } from "./AddStorageProvider";
import { StorageProvidersGrid } from "./StorageProvidersGrid";

export function StorageProvidersPage() {
  const queryRef = useLoaderData() as StorageProvidersLoader;

  return (
    <>
      <PageHeader
        actions={<AddStorageProvider />}
        subtitle="S3-compatible storage backends for your model artifacts. Each model version is stored at a unique prefix."
        title="Storage Providers"
      />
      <Suspense>
        <StorageProvidersGrid queryRef={queryRef} />
      </Suspense>
    </>
  );
}
