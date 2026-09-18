import type { ModelLoader } from "@/features/models/loaders/modelLoader";
import type { ModelVersionsLoader } from "@/features/modelVersions/loaders/modelVersionsLoader";
import { useReadQuery } from "@apollo/client";
import { Button } from "@mantine/core";
import { CloudIcon, FolderIcon } from "lucide-react";
import { Suspense } from "react";
import { useRouteLoaderData } from "react-router";

import { MetaItem, MetaList, MetaStrong } from "@/components/metaList/MetaList";
import { PageHeader } from "@/components/pageHeader/PageHeader";
import { ArchivableStatus } from "@/components/statusBadge/StatusBadge";
import { ArchiveModel } from "@/features/models/components/ArchiveModel";
import { EditModel } from "@/features/models/components/EditModel";
import { formatDate } from "@/utils/formatters";

import { AddModelVersion } from "./AddModelVersion";
import { ModelVersionsTable } from "./ModelVersionsTable";

export function ModelVersionsPage() {
  const [modelVersionsQueryRef, modelQueryRef] = useRouteLoaderData(
    "model",
  ) as [ModelVersionsLoader, ModelLoader];

  const { data } = useReadQuery(modelQueryRef);
  const model = data.getMLModel;
  const isArchived = !!model?.isArchived;

  return (
    <>
      <PageHeader
        actions={(
          <>
            <ArchiveModel
              isArchived={isArchived}
              modelId={model?.modelId ?? ""}
              modelName={model?.modelName ?? ""}
              trigger={<Button size="sm" variant="danger">Archive</Button>}
            />
            <EditModel
              isArchived={isArchived}
              modelId={model?.modelId ?? ""}
              originalDescription={model?.description ?? ""}
              originalModelName={model?.modelName ?? ""}
              originalProjectId={model?.project?.projectId ?? ""}
              originalStorageProviderId={model?.storageProvider?.providerId ?? ""}
              trigger={<Button size="sm" variant="default">Edit</Button>}
            />
            <AddModelVersion disabled={isArchived} modelId={model?.modelId ?? ""} />
          </>
        )}
        badge={<ArchivableStatus isArchived={isArchived} />}
        description={model?.description}
        meta={(
          <MetaList>
            <MetaItem>
              <FolderIcon size={12} />
              <MetaStrong>{model?.project?.name ?? "—"}</MetaStrong>
            </MetaItem>
            <MetaItem>
              <CloudIcon size={12} />
              <MetaStrong>{model?.storageProvider?.bucket ?? "—"}</MetaStrong>
            </MetaItem>
            <MetaItem>
              By
              {" "}
              <MetaStrong>{model?.createdBy?.realName ?? "—"}</MetaStrong>
            </MetaItem>
            <MetaItem>
              Created
              {" "}
              {formatDate(model?.dateCreated)}
            </MetaItem>
          </MetaList>
        )}
        title={<span style={{ fontFamily: "var(--font-mono)" }}>{model?.modelName}</span>}
      />
      <Suspense>
        <ModelVersionsTable queryRef={modelVersionsQueryRef} />
      </Suspense>
    </>
  );
}
