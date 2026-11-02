import type { ModelVersionLoader } from "@/features/modelVersions/loaders/modelVersionLoader";
import { useReadQuery } from "@apollo/client";
import { FileTextIcon } from "lucide-react";
import { useLoaderData } from "react-router";

import { EmptyState } from "@/components/emptyState/EmptyState";
import { Panel } from "@/components/panel/Panel";
import { ModelCard } from "@/features/modelVersions/components/ModelCard";
import { parseModelMetadata } from "@/features/modelVersions/utils/modelMetadata";

export function ModelVersionCardPage() {
  const queryRef = useLoaderData() as ModelVersionLoader;
  const { data } = useReadQuery(queryRef);
  const metadata = parseModelMetadata(data.modelVersion.get?.metadata);

  if (metadata) {
    return <ModelCard metadata={metadata} />;
  }

  return (
    <Panel>
      <Panel.Header title="Model Card" />
      <EmptyState
        description="Versions saved with log_model in pydstk show their framework and parameters here."
        icon={<FileTextIcon size={24} />}
        title="No model card yet"
      />
    </Panel>
  );
}
