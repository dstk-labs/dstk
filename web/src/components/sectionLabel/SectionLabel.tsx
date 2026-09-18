import type { CSSProperties } from "react";

type SectionLabelProps = React.PropsWithChildren<{
  style?: CSSProperties;
}>;

export function SectionLabel({ children, style }: SectionLabelProps) {
  return (
    <div
      style={{
        color: "var(--color-text-muted)",
        fontSize: "var(--font-size-3xs)",
        fontWeight: "var(--font-medium)",
        letterSpacing: "0.8px",
        marginBottom: "var(--space-1)",
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
