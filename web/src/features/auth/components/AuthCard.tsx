export function AuthCard({ children }: React.PropsWithChildren) {
  return (
    <div
      style={{
        background: "var(--color-bg-secondary)",
        border: "var(--border-width) solid var(--color-border-default)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-8)",
      }}
    >
      {children}
    </div>
  );
}

export function AuthFooterText({ children }: React.PropsWithChildren) {
  return (
    <p
      style={{
        color: "var(--color-text-muted)",
        fontSize: "var(--font-size-xs)",
        margin: "var(--space-6) 0 0",
        textAlign: "center",
      }}
    >
      {children}
    </p>
  );
}
