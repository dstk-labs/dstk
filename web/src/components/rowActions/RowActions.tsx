import type { ReactNode } from "react";
import { ActionIcon, Tooltip } from "@mantine/core";

type RowActionProps = {
  danger?: boolean;
  disabled?: boolean;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
};

export function RowAction({
  danger = false,
  disabled = false,
  icon,
  label,
  onClick,
}: RowActionProps) {
  return (
    <Tooltip disabled={disabled} label={label}>
      <ActionIcon
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        size={28}
        variant={danger ? "danger" : "subtle"}
      >
        {icon}
      </ActionIcon>
    </Tooltip>
  );
}

export function RowActions({ children }: React.PropsWithChildren) {
  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}
    >
      {children}
    </div>
  );
}
