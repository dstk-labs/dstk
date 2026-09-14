import type { CSSProperties, ReactNode } from "react";

type PanelProps = React.PropsWithChildren<{
  danger?: boolean;
  style?: CSSProperties;
}>;

type PanelHeaderProps = {
  actions?: ReactNode;
  title: ReactNode;
};

type PanelBodyProps = React.PropsWithChildren<{
  flush?: boolean;
  style?: CSSProperties;
}>;

function PanelRoot({ children, danger = false, style }: PanelProps) {
  return (
    <section
      style={{
        background: "var(--color-bg-secondary)",
        border: `var(--border-width) solid ${
          danger ? "rgba(224, 108, 117, 0.2)" : "var(--color-border-default)"
        }`,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function PanelHeader({ actions, title }: PanelHeaderProps) {
  return (
    <div
      style={{
        alignItems: "center",
        borderBottom: "var(--border-width) solid var(--color-border-default)",
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--space-3)",
        justifyContent: "space-between",
        padding: "18px var(--space-6)",
      }}
    >
      <h3
        style={{
          fontSize: "var(--font-size-sm)",
          fontWeight: "var(--font-regular)",
          margin: 0,
        }}
      >
        {title}
      </h3>
      {actions && (
        <div style={{ alignItems: "center", display: "flex", gap: "var(--space-2)" }}>
          {actions}
        </div>
      )}
    </div>
  );
}

function PanelBody({ children, flush = false, style }: PanelBodyProps) {
  return (
    <div style={{ padding: flush ? 0 : "var(--space-6)", ...style }}>
      {children}
    </div>
  );
}

export const Panel = Object.assign(PanelRoot, {
  Body: PanelBody,
  Header: PanelHeader,
});
