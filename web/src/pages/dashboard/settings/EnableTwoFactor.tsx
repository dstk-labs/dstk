import { useMutation } from "@apollo/client";
import {
  ActionIcon,
  Button,
  CopyButton,
  PasswordInput,
  PinInput,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { CheckIcon, CopyIcon, ShieldCheckIcon } from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";

import { Modal } from "@/components/modal/Modal";
import { ModalFooter } from "@/components/modalFooter/ModalFooter";
import { BackupCodes } from "@/features/auth/components/BackupCodes";
import { GET_USER } from "@/features/auth/loaders/authLoader";
import { gql } from "@/graphql";

const ENABLE_TWO_FACTOR = gql(`
  mutation EnableTwoFactor($data: TwoFactorPasswordInput!) {
    enableTwoFactor(data: $data) {
      totpUri
      backupCodes
    }
  }
`);

const VERIFY_TOTP = gql(`
  mutation ConfirmTotpEnrollment($data: TwoFactorCodeInput!) {
    verifyTotp(data: $data)
  }
`);

const CODE_LENGTH = 6;

type Enrollment = {
  totpUri: string;
  backupCodes: string[];
};

function getSecret(totpUri: string) {
  return new URL(totpUri).searchParams.get("secret") ?? "";
}

export function EnableTwoFactor() {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [opened, { close, open }] = useDisclosure(false);

  const [enableTwoFactor, { loading: enableLoading }] = useMutation(ENABLE_TWO_FACTOR);
  const [verifyTotp, { loading: verifyLoading }] = useMutation(VERIFY_TOTP);

  const loading = enableLoading || verifyLoading;

  const onClose = () => {
    close();
    setEnrollment(null);
    setPassword("");
    setCode("");
  };

  const onStart = () =>
    enableTwoFactor({
      onCompleted: (data) => {
        if (data.enableTwoFactor) {
          setEnrollment({
            backupCodes: data.enableTwoFactor.backupCodes?.filter(Boolean) ?? [],
            totpUri: data.enableTwoFactor.totpUri ?? "",
          });
        }
      },
      onError: () => setPassword(""),
      variables: { data: { password } },
    });

  const onConfirm = () =>
    verifyTotp({
      onCompleted: () => {
        notifications.show({
          color: "green",
          message: "You will be asked for a code the next time you sign in.",
          title: "Two-factor authentication is on",
        });
        onClose();
      },
      onError: () => setCode(""),
      refetchQueries: [{ query: GET_USER }],
      variables: { data: { code, trustDevice: false } },
    });

  return (
    <>
      <Modal
        disabled={loading}
        onClose={onClose}
        opened={opened}
        title="Turn On Two-Factor Authentication"
      >
        {enrollment
          ? (
              <Stack gap="md">
                <Text c="var(--color-text-secondary)" fw={300} size="sm">
                  Scan this with your authenticator app, then enter the code it shows.
                </Text>
                <div
                  style={{
                    alignSelf: "center",
                    background: "var(--white, #fff)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-3)",
                  }}
                >
                  <QRCode size={160} value={enrollment.totpUri} />
                </div>
                <div style={{ alignItems: "center", display: "flex", gap: "var(--space-2)" }}>
                  <Text c="var(--color-text-muted)" fw={300} size="xs">
                    Can't scan? Enter this key instead:
                  </Text>
                  <code style={{ overflowWrap: "anywhere" }}>
                    {getSecret(enrollment.totpUri)}
                  </code>
                  <CopyButton value={getSecret(enrollment.totpUri)}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? "Copied" : "Copy"}>
                        <ActionIcon aria-label="Copy setup key" onClick={copy} size={24}>
                          {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                </div>
                <BackupCodes codes={enrollment.backupCodes} />
                <PinInput
                  aria-label="Verification code"
                  disabled={loading}
                  length={CODE_LENGTH}
                  oneTimeCode
                  onChange={setCode}
                  type="number"
                  value={code}
                />
                <ModalFooter
                  disabled={code.length < CODE_LENGTH}
                  loading={loading}
                  onCancel={onClose}
                  onSubmit={onConfirm}
                  submitLabel="Confirm and turn on"
                />
              </Stack>
            )
          : (
              <>
                <Text c="var(--color-text-secondary)" fw={300} size="sm">
                  Confirm your password to start setting up an authenticator app.
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
                  onSubmit={onStart}
                  submitLabel="Continue"
                />
              </>
            )}
      </Modal>

      <Button leftSection={<ShieldCheckIcon size={14} />} onClick={open} size="sm">
        Turn on
      </Button>
    </>
  );
}
