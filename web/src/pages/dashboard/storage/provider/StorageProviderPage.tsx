import type { StorageProviderLoader } from "@/features/storage/loaders/storageProviderLoader";
import { useReadQuery } from "@apollo/client";
import { SimpleGrid } from "@mantine/core";
import { Suspense } from "react";
import { useLoaderData } from "react-router";

import { MetaItem, MetaList, MetaStrong } from "@/components/metaList/MetaList";
import { PageHeader } from "@/components/pageHeader/PageHeader";
import { Panel } from "@/components/panel/Panel";
import { RowActions } from "@/components/rowActions/RowActions";
import { SectionLabel } from "@/components/sectionLabel/SectionLabel";
import { ArchivableStatus } from "@/components/statusBadge/StatusBadge";
import { formatDate } from "@/utils/formatters";

import { ArchiveStorageProvider } from "../ArchiveStorageProvider";
import { EditStorageProvider } from "../EditStorageProvider";

type DetailProps = {
  label: string;
  value: React.ReactNode;
};

function Detail({ label, value }: DetailProps) {
  return (
    <div style={{ minWidth: 0 }}>
      <SectionLabel>{label}</SectionLabel>
      <div
        style={{
          color: "var(--color-text-secondary)",
          fontSize: "var(--font-size-xs)",
          fontWeight: "var(--font-light)",
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function StorageProviderContent({ queryRef }: { queryRef: StorageProviderLoader }) {
  const { data } = useReadQuery(queryRef);
  const provider = data.getStorageProvider;
  const isArchived = !!provider?.isArchived;

  return (
    <>
      <PageHeader
        actions={(
          <RowActions>
            <EditStorageProvider
              bucket={provider?.bucket ?? ""}
              isArchived={isArchived}
              originalAccessKeyId={provider?.accessKeyId ?? ""}
              providerId={provider?.providerId ?? ""}
            />
            <ArchiveStorageProvider
              bucket={provider?.bucket ?? ""}
              isArchived={isArchived}
              providerId={provider?.providerId ?? ""}
            />
          </RowActions>
        )}
        badge={<ArchivableStatus isArchived={isArchived} />}
        meta={(
          <MetaList>
            <MetaItem>
              Owner
              {" "}
              <MetaStrong>{provider?.owner?.realName ?? "—"}</MetaStrong>
            </MetaItem>
            <MetaItem>
              Created
              {" "}
              {formatDate(provider?.dateCreated)}
            </MetaItem>
            <MetaItem>
              Modified
              {" "}
              {formatDate(provider?.dateModified)}
            </MetaItem>
          </MetaList>
        )}
        title={<span style={{ fontFamily: "var(--font-mono)" }}>{provider?.bucket}</span>}
      />
      <Panel>
        <Panel.Header title="Connection" />
        <Panel.Body>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            <Detail label="Endpoint" value={<code>{provider?.endpointUrl}</code>} />
            <Detail label="Region" value={provider?.region} />
            <Detail label="Created By" value={provider?.createdBy?.realName ?? "—"} />
            <Detail label="Modified By" value={provider?.modifiedBy?.realName ?? "—"} />
          </SimpleGrid>
        </Panel.Body>
      </Panel>
    </>
  );
}

export function StorageProviderPage() {
  const queryRef = useLoaderData() as StorageProviderLoader;

  return (
    <Suspense>
      <StorageProviderContent queryRef={queryRef} />
    </Suspense>
  );
}
