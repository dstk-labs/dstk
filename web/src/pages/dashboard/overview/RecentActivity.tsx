import type { OverviewQuery } from "@/graphql/types";

import { Anchor } from "@/components/anchor/Anchor";
import { TableCard } from "@/components/tableCard/TableCard";
import { paths } from "@/config/paths";
import { AuditLogTable } from "@/features/auditLogs/components/AuditLogTable";

type RecentActivityProps = {
  logs: NonNullable<NonNullable<OverviewQuery["auditLog"]["list"]>["edges"]>;
};

export function RecentActivity({ logs }: RecentActivityProps) {
  const nodes = logs
    .map(edge => edge.node)
    .filter((log): log is NonNullable<typeof log> => Boolean(log));

  return (
    <TableCard>
      <TableCard.Toolbar
        end={(
          <Anchor size="xs" to={paths.dashboard.logs.path}>
            View all →
          </Anchor>
        )}
        start={(
          <span style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-regular)" }}>
            Recent Activity
          </span>
        )}
      />
      <AuditLogTable emptyDescription="Changes made in this team will show up here." logs={nodes} />
    </TableCard>
  );
}
