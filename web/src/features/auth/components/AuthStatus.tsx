import type { ReactNode } from "react";
import { CheckIcon, MailIcon, XIcon } from "lucide-react";

import { SpinnerRing } from "@/components/spinnerRing/SpinnerRing";

type AuthStatusProps = {
  actions?: ReactNode;
  subtitle: ReactNode;
  title: ReactNode;
  tone?: "error" | "info" | "loading" | "success";
};

const BADGE_TONES = {
  error: {
    background: "var(--color-error-alpha-strong)",
    border: "2px solid var(--color-error)",
    color: "var(--color-error)",
    icon: <XIcon size={22} />,
  },
  info: {
    background: "var(--color-alpha-medium)",
    border: "2px solid var(--sky-400)",
    color: "var(--sky-200)",
    icon: <MailIcon size={22} />,
  },
  success: {
    background: "var(--color-success-alpha)",
    border: "2px solid var(--color-success)",
    color: "var(--color-success)",
    icon: <CheckIcon size={22} />,
  },
};

function StatusBadge({ tone }: { tone: keyof typeof BADGE_TONES }) {
  const { icon, ...style } = BADGE_TONES[tone];
  return (
    <div
      style={{
        ...style,
        alignItems: "center",
        animation: "sky-pop-in 0.4s ease forwards",
        borderRadius: "var(--radius-full)",
        display: "flex",
        fontSize: "var(--font-size-xl)",
        fontWeight: "var(--font-medium)",
        height: 56,
        justifyContent: "center",
        opacity: 0,
        transform: "scale(0.8)",
        width: 56,
      }}
    >
      {icon}
    </div>
  );
}

export function AuthStatus({
  actions,
  subtitle,
  title,
  tone = "loading",
}: AuthStatusProps) {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
        margin: "0 auto",
        maxWidth: "22rem",
        textAlign: "center",
      }}
    >
      {tone === "loading" ? <SpinnerRing /> : <StatusBadge tone={tone} />}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <p
          style={{
            fontSize: "var(--font-size-sm)",
            fontWeight: "var(--font-regular)",
            letterSpacing: "var(--tracking-normal)",
            margin: 0,
          }}
        >
          {title}
        </p>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--font-size-2xs)",
            lineHeight: "var(--leading-relaxed)",
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      </div>
      {actions && (
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
            width: "100%",
          }}
        >
          {actions}
        </div>
      )}
    </div>
  );
}
