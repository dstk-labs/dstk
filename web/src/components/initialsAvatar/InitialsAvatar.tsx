import type { StatusTone } from "@/components/statusBadge/StatusBadge";

type InitialsAvatarProps = {
  name: string;
  radius?: "md" | "sm" | "xl";
  size?: number;
};

const TONE_ORDER: StatusTone[] = ["sky", "success", "warning", "error", "purple"];

const TONE_STYLES: Record<StatusTone, { background: string; color: string }> = {
  error: { background: "rgba(224, 108, 117, 0.15)", color: "var(--color-error)" },
  neutral: { background: "var(--color-bg-elevated)", color: "var(--color-text-muted)" },
  purple: { background: "rgba(180, 140, 255, 0.15)", color: "var(--color-purple)" },
  sky: { background: "var(--color-alpha-strong)", color: "var(--sky-200)" },
  success: { background: "rgba(88, 214, 141, 0.15)", color: "var(--color-success)" },
  warning: { background: "rgba(240, 199, 94, 0.15)", color: "var(--color-warning)" },
};

const RADII = {
  md: "var(--radius-md)",
  sm: "var(--radius-sm)",
  xl: "var(--radius-full)",
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join("");
}

function toneForName(name: string): StatusTone {
  let hash = 0;
  for (const char of name)
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return TONE_ORDER[hash % TONE_ORDER.length];
}

export function InitialsAvatar({
  name,
  radius = "xl",
  size = 32,
}: InitialsAvatarProps) {
  return (
    <div
      aria-hidden
      style={{
        ...TONE_STYLES[toneForName(name)],
        alignItems: "center",
        border: radius === "xl"
          ? "var(--border-width) solid var(--color-border-accent)"
          : undefined,
        borderRadius: RADII[radius],
        display: "flex",
        flexShrink: 0,
        fontSize: Math.max(9, Math.round(size * 0.34)),
        fontWeight: "var(--font-regular)",
        height: size,
        justifyContent: "center",
        width: size,
      }}
    >
      {getInitials(name) || "?"}
    </div>
  );
}
