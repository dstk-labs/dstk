import { useMutation } from "@apollo/client";
import { Button, PasswordInput, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

import { Modal } from "@/components/modal/Modal";
import { ModalFooter } from "@/components/modalFooter/ModalFooter";
import { BackupCodes } from "@/features/auth/components/BackupCodes";
import { gql } from "@/graphql";

const REGENERATE_BACKUP_CODES = gql(`
  mutation RegenerateBackupCodes($data: TwoFactorPasswordInput!) {
    regenerateBackupCodes(data: $data)
  }
`);

export function RegenerateBackupCodes() {
  const [codes, setCodes] = useState<string[] | null>(null);
  const [password, setPassword] = useState("");
  const [opened, { close, open }] = useDisclosure(false);

  const [regenerateBackupCodes, { loading }] = useMutation(REGENERATE_BACKUP_CODES);

  const onClose = () => {
    close();
    setCodes(null);
    setPassword("");
  };

  const onConfirm = () =>
    regenerateBackupCodes({
      onCompleted: data => setCodes(data.regenerateBackupCodes ?? []),
      onError: () => setPassword(""),
      variables: { data: { password } },
    });

  return (
    <>
      <Modal disabled={loading} onClose={onClose} opened={opened} title="New Backup Codes">
        {codes
          ? (
              <>
                <BackupCodes codes={codes} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "var(--space-6)",
                  }}
                >
                  <Button onClick={onClose} size="sm">
                    Done
                  </Button>
                </div>
              </>
            )
          : (
              <>
                <Text c="var(--color-text-secondary)" fw={300} size="sm">
                  This replaces your existing backup codes. Any code you saved before stops
                  working.
                </Text>
                <PasswordInput
                  autoComplete="current-password"
                  disabled={loading}
                  label="Password"
                  mt="md"
                  onChange={event => setPassword(event.currentTarget.value)}
                  placeholder="Your password"
                  value={password}
                />
                <ModalFooter
                  disabled={password.length === 0}
                  loading={loading}
                  onCancel={onClose}
                  onSubmit={onConfirm}
                  submitLabel="Generate new codes"
                />
              </>
            )}
      </Modal>

      <Button onClick={open} size="sm" variant="default">
        New backup codes
      </Button>
    </>
  );
}
