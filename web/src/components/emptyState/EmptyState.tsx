import type { ReactNode } from "react";
import { Table } from "@mantine/core";
import { InboxIcon } from "lucide-react";

type EmptyStateProps = {
  action?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
};

export function EmptyState({
  action,
  description,
  icon = <InboxIcon size={24} />,
  title,
}: EmptyStateProps) {
  return (
    <div style={{ padding: "var(--space-12) var(--space-5)", textAlign: "center" }}>
      <div
        style={{
          color: "var(--color-text-muted)",
          display: "flex",
          justifyContent: "center",
          marginBottom: "var(--space-3)",
          opacity: 0.4,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: "var(--font-size-sm)",
          fontWeight: "var(--font-regular)",
          marginBottom: "var(--space-1)",
        }}
      >
        {title}
      </div>
      {description && (
        <div
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--font-size-xs)",
            fontWeight: "var(--font-light)",
          }}
        >
          {description}
        </div>
      )}
      {action && <div style={{ marginTop: "var(--space-5)" }}>{action}</div>}
    </div>
  );
}

type EmptyTableRowProps = EmptyStateProps & {
  colSpan: number;
};

export function EmptyTableRow({ colSpan, ...props }: EmptyTableRowProps) {
  return (
    <Table.Tr>
      <Table.Td colSpan={colSpan} style={{ padding: 0 }}>
        <EmptyState {...props} />
      </Table.Td>
    </Table.Tr>
  );
}
