import { CheckIcon } from "lucide-react";

export type PasswordRule = {
  message: string;
  name: string;
  test: (value: string) => boolean;
};

type PasswordStrengthProps = {
  password: string;
  rules: readonly PasswordRule[];
};

function scoreColor(score: number, total: number) {
  const ratio = score / total;
  if (ratio <= 0.4)
    return "var(--color-error)";
  if (ratio <= 0.6)
    return "var(--color-warning)";
  if (ratio < 1)
    return "var(--sky-400)";
  return "var(--color-success)";
}

export function PasswordStrength({ password, rules }: PasswordStrengthProps) {
  if (password.length === 0)
    return null;

  const results = rules.map(rule => ({ ...rule, met: rule.test(password) }));
  const score = results.filter(rule => rule.met).length;
  const color = scoreColor(score, rules.length);

  return (
    <div style={{ marginTop: "var(--space-2)" }}>
      <div style={{ display: "flex", gap: "var(--space-1)", marginBottom: "var(--space-2)" }}>
        {rules.map((rule, index) => (
          <div
            key={rule.name}
            style={{
              background: index < score ? color : "var(--color-border-default)",
              borderRadius: 2,
              flex: 1,
              height: 3,
              transition: "background var(--transition-normal)",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        {results.map(rule => (
          <div
            key={rule.name}
            style={{
              alignItems: "center",
              color: rule.met ? "var(--color-success)" : "var(--color-text-muted)",
              display: "flex",
              fontSize: "var(--font-size-2xs)",
              fontWeight: "var(--font-light)",
              gap: "var(--space-2)",
              transition: "color var(--transition-normal)",
            }}
          >
            <span
              style={{
                alignItems: "center",
                background: rule.met ? "var(--color-success-alpha)" : "transparent",
                border: `var(--border-width) solid ${
                  rule.met ? "var(--color-success)" : "var(--color-border-default)"
                }`,
                borderRadius: "var(--radius-full)",
                display: "flex",
                flexShrink: 0,
                height: 16,
                justifyContent: "center",
                width: 16,
              }}
            >
              {rule.met && <CheckIcon size={9} />}
            </span>
            {rule.message}
          </div>
        ))}
      </div>
    </div>
  );
}
