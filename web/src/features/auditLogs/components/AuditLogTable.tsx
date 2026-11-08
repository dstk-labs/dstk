import type { ListAuditLogsQuery } from "@/graphql/types";
import { Table } from "@mantine/core";
import { ScrollTextIcon } from "lucide-react";

import { DateCell } from "@/components/dateCell/DateCell";
import { EmptyTableRow } from "@/components/emptyState/EmptyState";
import { InitialsAvatar } from "@/components/initialsAvatar/InitialsAvatar";
import { TableCard } from "@/components/tableCard/TableCard";
import { describeAuditLog } from "@/features/auditLogs/utils/auditLogLabels";

type AuditLog = NonNullable<NonNullable<NonNullable<ListAuditLogsQuery["auditLog"]["list"]>["edges"]>[number]["node"]>;

type AuditLogTableProps = {
  emptyDescription: string;
  logs: AuditLog[];
};

export function AuditLogTable({ emptyDescription, logs }: AuditLogTableProps) {
  return (
    <TableCard.Table minWidth={640}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Event</Table.Th>
          <Table.Th>Member</Table.Th>
          <Table.Th>When</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {logs.length === 0 && (
          <EmptyTableRow
            colSpan={3}
            description={emptyDescription}
            icon={<ScrollTextIcon size={24} />}
            title="No logs"
          />
        )}
        {logs.map(log => (
          <Table.Tr key={log.auditLogId}>
            <Table.Td style={{ whiteSpace: "normal" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>{describeAuditLog(log)}</span>
              {" "}
              <span style={{ fontFamily: "var(--font-mono)" }}>{log.resourceName}</span>
            </Table.Td>
            <Table.Td>
              <div style={{ alignItems: "center", display: "flex", gap: "var(--space-2)" }}>
                <InitialsAvatar name={log.actor?.realName ?? ""} size={24} />
                {log.actor?.realName ?? "—"}
              </div>
            </Table.Td>
            <Table.Td>
              <DateCell value={log.dateCreated} />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </TableCard.Table>
  );
}
