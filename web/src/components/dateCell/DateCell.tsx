import { formatDate, formatRelative } from "@/utils/formatters";

type DateCellProps = {
  value: null | string | undefined;
};

export function DateCell({ value }: DateCellProps) {
  return (
    <div style={{ fontSize: "var(--font-size-2xs)", lineHeight: 1.4 }}>
      <div style={{ color: "var(--color-text-secondary)" }}>{formatDate(value)}</div>
      <div style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-3xs)", opacity: 0.8 }}>
        {formatRelative(value)}
      </div>
    </div>
  );
}
