import { useMutation } from "@apollo/client";
import { Button, PasswordInput, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

import { Modal } from "@/components/modal/Modal";
import { ModalFooter } from "@/components/modalFooter/ModalFooter";
import { GET_USER } from "@/features/auth/loaders/authLoader";
import { gql } from "@/graphql";

const DISABLE_TWO_FACTOR = gql(`
  mutation DisableTwoFactor($data: TwoFactorPasswordInput!) {
    disableTwoFactor(data: $data)
  }
`);

export function DisableTwoFactor() {
  const [password, setPassword] = useState("");
  const [opened, { close, open }] = useDisclosure(false);

  const [disableTwoFactor, { loading }] = useMutation(DISABLE_TWO_FACTOR);

  const onClose = () => {
    close();
    setPassword("");
  };

  const onConfirm = () =>
    disableTwoFactor({
      onCompleted: () => onClose(),
      onError: () => setPassword(""),
      refetchQueries: [{ query: GET_USER }],
      variables: { data: { password } },
    });

  return (
    <>
      <Modal
        disabled={loading}
        onClose={onClose}
        opened={opened}
        title="Turn Off Two-Factor Authentication"
      >
        <Text c="var(--color-text-secondary)" fw={300} size="sm">
          Your authenticator app and every backup code stop working. Confirm your password to
          continue.
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
          submitLabel="Turn off"
          tone="danger"
        />
      </Modal>

      <Button onClick={open} size="sm" variant="default">
        Turn off
      </Button>
    </>
  );
}
