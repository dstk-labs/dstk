export function MetaList({ children }: React.PropsWithChildren) {
  return (
    <div
      style={{
        alignItems: "center",
        color: "var(--color-text-muted)",
        display: "flex",
        flexWrap: "wrap",
        fontSize: "var(--font-size-2xs)",
        fontWeight: "var(--font-light)",
        gap: "var(--space-4)",
      }}
    >
      {children}
    </div>
  );
}

export function MetaItem({ children }: React.PropsWithChildren) {
  return (
    <div style={{ alignItems: "center", display: "flex", gap: 5 }}>
      {children}
    </div>
  );
}

export function MetaStrong({ children }: React.PropsWithChildren) {
  return (
    <strong
      style={{ color: "var(--color-text-secondary)", fontWeight: "var(--font-regular)" }}
    >
      {children}
    </strong>
  );
}
