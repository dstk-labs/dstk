import { Button } from "@mantine/core";

type ModalFooterProps = {
  cancelLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  onCancel: () => void;
  onSubmit?: () => void;
  submitLabel: string;
  tone?: "danger" | "primary";
};

export function ModalFooter({
  cancelLabel = "Cancel",
  disabled = false,
  loading = false,
  onCancel,
  onSubmit,
  submitLabel,
  tone = "primary",
}: ModalFooterProps) {
  return (
    <div
      style={{
        alignItems: "center",
        borderTop: "var(--border-width) solid var(--color-border-default)",
        display: "flex",
        gap: "var(--space-2)",
        justifyContent: "flex-end",
        margin: "var(--space-6) calc(var(--space-6) * -1) calc(var(--space-6) * -1)",
        padding: "var(--space-4) var(--space-6)",
      }}
    >
      <Button disabled={loading} onClick={onCancel} size="sm" variant="default">
        {cancelLabel}
      </Button>
      <Button
        disabled={disabled}
        loading={loading}
        onClick={onSubmit}
        size="sm"
        type={onSubmit ? "button" : "submit"}
        variant={tone === "danger" ? "danger-filled" : "filled"}
      >
        {submitLabel}
      </Button>
    </div>
  );
}
