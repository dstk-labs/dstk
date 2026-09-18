import type { CSSProperties, ReactNode } from "react";
import { Table } from "@mantine/core";

type TableCardProps = React.PropsWithChildren<{
  style?: CSSProperties;
}>;

type TableCardToolbarProps = {
  end?: ReactNode;
  start?: ReactNode;
};

type TableCardFooterProps = {
  end?: ReactNode;
  start?: ReactNode;
};

type TableCardTableProps = React.PropsWithChildren<{
  minWidth?: number;
}>;

function TableCardRoot({ children, style }: TableCardProps) {
  return (
    <div
      style={{
        background: "var(--color-bg-secondary)",
        border: "var(--border-width) solid var(--color-border-default)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function TableCardToolbar({ end, start }: TableCardToolbarProps) {
  return (
    <div
      style={{
        alignItems: "center",
        borderBottom: "var(--border-width) solid var(--color-border-default)",
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--space-3)",
        padding: "var(--space-4) var(--space-5)",
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flex: "1 1 240px",
          flexWrap: "wrap",
          gap: "var(--space-3)",
          minWidth: 0,
        }}
      >
        {start}
      </div>
      {end && (
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-2)",
            marginLeft: "auto",
          }}
        >
          {end}
        </div>
      )}
    </div>
  );
}

function TableCardTable({ children, minWidth = 640 }: TableCardTableProps) {
  return (
    <Table.ScrollContainer minWidth={minWidth} type="native">
      <Table>{children}</Table>
    </Table.ScrollContainer>
  );
}

function TableCardFooter({ end, start }: TableCardFooterProps) {
  return (
    <div
      style={{
        alignItems: "center",
        borderTop: "var(--border-width) solid var(--color-border-default)",
        color: "var(--color-text-muted)",
        display: "flex",
        flexWrap: "wrap",
        fontSize: "var(--font-size-2xs)",
        fontWeight: "var(--font-light)",
        gap: "var(--space-4)",
        justifyContent: "space-between",
        padding: "14px var(--space-5)",
      }}
    >
      <div style={{ alignItems: "center", display: "flex", gap: "var(--space-3)" }}>
        {start}
      </div>
      <div style={{ alignItems: "center", display: "flex", gap: "var(--space-1)" }}>
        {end}
      </div>
    </div>
  );
}

export const TableCard = Object.assign(TableCardRoot, {
  Footer: TableCardFooter,
  Table: TableCardTable,
  Toolbar: TableCardToolbar,
});
