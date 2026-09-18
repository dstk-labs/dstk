import type { ReactNode } from "react";
import { SectionLabel } from "@/components/sectionLabel/SectionLabel";

type StatCardProps = {
  label: ReactNode;
  value: ReactNode;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div
      style={{
        background: "var(--color-bg-secondary)",
        border: "var(--border-width) solid var(--color-border-default)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-5)",
      }}
    >
      <SectionLabel style={{ marginBottom: "var(--space-2)" }}>{label}</SectionLabel>
      <div
        style={{
          fontSize: "var(--font-size-3xl)",
          fontWeight: "var(--font-display)",
          letterSpacing: "-0.5px",
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
    </div>
  );
}
