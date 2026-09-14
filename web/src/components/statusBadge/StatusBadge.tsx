import { Badge } from "@mantine/core";

export type StatusTone = "error" | "neutral" | "purple" | "sky" | "success" | "warning";

type StatusBadgeProps = React.PropsWithChildren<{
  tone: StatusTone;
}>;

const TONES: Record<StatusTone, { background: string; color: string }> = {
  error: { background: "var(--color-error-alpha)", color: "var(--color-error)" },
  neutral: { background: "var(--color-neutral-alpha)", color: "var(--color-text-muted)" },
  purple: { background: "var(--color-purple-alpha)", color: "var(--color-purple)" },
  sky: { background: "var(--color-alpha-medium)", color: "var(--sky-200)" },
  success: { background: "var(--color-success-alpha)", color: "var(--color-success)" },
  warning: { background: "var(--color-warning-alpha)", color: "var(--color-warning)" },
};

export function StatusBadge({ children, tone }: StatusBadgeProps) {
  return (
    <Badge radius="xl" style={TONES[tone]} variant="filled">
      {children}
    </Badge>
  );
}

type ArchivableStatusProps = {
  isArchived: boolean;
};

export function ArchivableStatus({ isArchived }: ArchivableStatusProps) {
  return isArchived
    ? <StatusBadge tone="neutral">Archived</StatusBadge>
    : <StatusBadge tone="success">Active</StatusBadge>;
}

type ModelVersionStatusProps = {
  isArchived: boolean;
  isFinalized: boolean;
};

export function ModelVersionStatus({
  isArchived,
  isFinalized,
}: ModelVersionStatusProps) {
  if (isArchived)
    return <StatusBadge tone="neutral">Archived</StatusBadge>;
  if (isFinalized)
    return <StatusBadge tone="success">Finalized</StatusBadge>;
  return <StatusBadge tone="sky">Draft</StatusBadge>;
}
