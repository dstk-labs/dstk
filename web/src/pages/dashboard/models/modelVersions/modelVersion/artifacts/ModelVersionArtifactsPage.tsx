import type { ModelVersionObjectsLoader } from "@/features/modelVersions/loaders/modelVersionObjectsLoader";
import { Suspense } from "react";
import { useLoaderData, useParams } from "react-router";

import { ModelVersionArtifactsTable } from "./ModelVersionArtifactsTable";
import { UploadArtifacts } from "./UploadArtifacts";

export function ModelVersionArtifactsPage() {
  const queryRef = useLoaderData() as ModelVersionObjectsLoader;
  const { modelVersionId = "" } = useParams();

  return (
    <Suspense>
      <ModelVersionArtifactsTable
        actions={<UploadArtifacts modelVersionId={modelVersionId} />}
        queryRef={queryRef}
      />
    </Suspense>
  );
}
