import { FileTextIcon } from "lucide-react";

import { EmptyState } from "@/components/emptyState/EmptyState";
import { Panel } from "@/components/panel/Panel";

export function ModelVersionCardPage() {
  return (
    <Panel>
      <Panel.Header title="Model Card" />
      <EmptyState
        description="Metrics, training details, and usage notes for this version will appear here once they are recorded."
        icon={<FileTextIcon size={24} />}
        title="No model card yet"
      />
    </Panel>
  );
}
