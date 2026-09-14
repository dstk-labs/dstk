import { Stack, Text, TextInput } from "@mantine/core";
import { useState } from "react";

import { Modal } from "@/components/modal/Modal";
import { ModalFooter } from "@/components/modalFooter/ModalFooter";

type ArchiveConfirmModalProps = {
  confirmValue: string;
  consequence: string;
  entityLabel: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
  opened: boolean;
  title: string;
};

export function ArchiveConfirmModal({
  confirmValue,
  consequence,
  entityLabel,
  loading,
  onClose,
  onConfirm,
  opened,
  title,
}: ArchiveConfirmModalProps) {
  const [inputValue, setInputValue] = useState("");

  const handleClose = () => {
    setInputValue("");
    onClose();
  };

  return (
    <Modal disabled={loading} onClose={handleClose} opened={opened} title={title}>
      <Stack gap="md">
        <Text c="var(--color-text-secondary)" fw={300} size="sm">
          This action is
          {" "}
          <Text c="var(--color-error)" fw={400} span>
            irreversible
          </Text>
          .
          {" "}
          {consequence}
        </Text>
        <TextInput
          autoComplete="off"
          disabled={loading}
          label={`Type the ${entityLabel} name to continue`}
          onChange={e => setInputValue(e.target.value)}
          placeholder={confirmValue}
          value={inputValue}
        />
      </Stack>
      <ModalFooter
        disabled={inputValue !== confirmValue}
        loading={loading}
        onCancel={handleClose}
        onSubmit={onConfirm}
        submitLabel={`Archive ${entityLabel}`}
        tone="danger"
      />
    </Modal>
  );
}
