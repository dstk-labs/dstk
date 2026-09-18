import type { ReactNode } from "react";

type PageHeaderProps = {
  actions?: ReactNode;
  badge?: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  subtitle?: ReactNode;
  title: ReactNode;
};

export function PageHeader({
  actions,
  badge,
  description,
  meta,
  subtitle,
  title,
}: PageHeaderProps) {
  return (
    <header style={{ marginBottom: "var(--space-7)" }}>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-4)",
          justifyContent: "space-between",
          marginBottom: subtitle || description ? "var(--space-2)" : 0,
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-3)",
            minWidth: 0,
          }}
        >
          <h1
            style={{
              fontSize: "var(--font-size-2xl)",
              fontWeight: "var(--font-light)",
              letterSpacing: "var(--tracking-tight)",
              lineHeight: "var(--leading-tight)",
              margin: 0,
              overflowWrap: "anywhere",
            }}
          >
            {title}
          </h1>
          {badge}
        </div>
        {actions && (
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexShrink: 0,
              flexWrap: "wrap",
              gap: "var(--space-2)",
            }}
          >
            {actions}
          </div>
        )}
      </div>
      {subtitle && (
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "var(--font-size-sm)",
            fontWeight: "var(--font-light)",
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      )}
      {description && (
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "var(--font-size-sm)",
            fontWeight: "var(--font-light)",
            lineHeight: 1.7,
            margin: `var(--space-3) 0 0`,
            maxWidth: 680,
          }}
        >
          {description}
        </p>
      )}
      {meta && <div style={{ marginTop: "var(--space-4)" }}>{meta}</div>}
    </header>
  );
}
