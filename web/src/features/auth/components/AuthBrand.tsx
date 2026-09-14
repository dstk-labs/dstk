import type { ReactNode } from "react";

import { BrandMark } from "@/components/brandMark/BrandMark";

type AuthBrandProps = {
  subtitle?: ReactNode;
  title: ReactNode;
};

export function AuthBrand({ subtitle, title }: AuthBrandProps) {
  return (
    <div style={{ marginBottom: "var(--space-8)", textAlign: "center" }}>
      <div style={{ marginBottom: "var(--space-4)" }}>
        <BrandMark size={48} />
      </div>
      <h1
        style={{
          fontSize: "var(--font-size-3xl)",
          fontWeight: "var(--font-light)",
          letterSpacing: "var(--tracking-normal)",
          lineHeight: 1.3,
          margin: "0 0 var(--space-1)",
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "var(--font-size-sm)",
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function AuthAccent({ children }: React.PropsWithChildren) {
  return <span style={{ color: "var(--sky-200)" }}>{children}</span>;
}
