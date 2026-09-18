import { ScrollTextIcon } from "lucide-react";

import { EmptyState } from "@/components/emptyState/EmptyState";
import { Panel } from "@/components/panel/Panel";

export function ModelVersionLogsPage() {
  return (
    <Panel>
      <Panel.Header title="Logs" />
      <EmptyState
        description="Activity for this version, such as uploads and status changes, will appear here."
        icon={<ScrollTextIcon size={24} />}
        title="No logs yet"
      />
    </Panel>
  );
}
