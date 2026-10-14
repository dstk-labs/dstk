import { useMutation, useQuery } from "@apollo/client";
import { Button, Code, Stack, Text } from "@mantine/core";

import { AuthStatus } from "@/features/auth/components/AuthStatus";
import { gql } from "@/graphql";

const DEVICE_VERIFY = gql(`
    query DeviceVerify($userCode: String!) {
        deviceVerify(userCode: $userCode) {
            id
            userCode
            clientId
            status
        }
    }
`);

const APPROVE_DEVICE = gql(`
    mutation ApproveDevice($userCode: String!) {
        approveDevice(userCode: $userCode) {
            id
            status
        }
    }
`);

const DENY_DEVICE = gql(`
    mutation DenyDevice($userCode: String!) {
        denyDevice(userCode: $userCode) {
            id
            status
        }
    }
`);

const USER_CODE_GROUP_LENGTH = 4;

function formatUserCode(userCode: string) {
  return `${userCode.slice(0, USER_CODE_GROUP_LENGTH)}-${userCode.slice(USER_CODE_GROUP_LENGTH)}`;
}

type DeviceRequestProps = {
  onReset: () => void;
  userCode: string;
};

export function DeviceRequest({ onReset, userCode }: DeviceRequestProps) {
  const { data, error, loading } = useQuery(DEVICE_VERIFY, {
    fetchPolicy: "network-only",
    variables: { userCode },
  });
  const [approveDevice, { error: approveError, loading: approving }] = useMutation(
    APPROVE_DEVICE,
    { variables: { userCode } },
  );
  const [denyDevice, { error: denyError, loading: denying }] = useMutation(
    DENY_DEVICE,
    { variables: { userCode } },
  );

  if (loading) {
    return <AuthStatus subtitle="One moment." title="Checking your code" />;
  }

  const requestError = error ?? approveError ?? denyError;

  if (requestError || !data?.deviceVerify) {
    return (
      <AuthStatus
        actions={(
          <Button fullWidth onClick={onReset}>
            Enter a different code
          </Button>
        )}
        subtitle={requestError?.message ?? "We could not find that code."}
        title="This code did not work"
        tone="error"
      />
    );
  }

  const { clientId, status } = data.deviceVerify;

  if (status === "approved") {
    return (
      <AuthStatus
        subtitle="Return to your terminal. You can close this tab."
        title="Device connected"
        tone="success"
      />
    );
  }

  if (status === "denied") {
    return (
      <AuthStatus
        subtitle="The device was not signed in. You can close this tab."
        title="Request denied"
        tone="error"
      />
    );
  }

  return (
    <Stack gap="lg">
      <Text c="var(--color-text-secondary)" fw={300} size="sm">
        {clientId ?? "A device"}
        {" "}
        wants to sign in to your account. Check that this code matches the one in your terminal.
      </Text>
      <Code block ta="center" fz="xl">
        {formatUserCode(data.deviceVerify.userCode ?? userCode)}
      </Code>
      <Stack gap="xs">
        <Button
          disabled={denying}
          fullWidth
          loading={approving}
          onClick={() => approveDevice()}
        >
          Approve
        </Button>
        <Button
          disabled={approving}
          fullWidth
          loading={denying}
          onClick={() => denyDevice()}
          variant="subtle"
        >
          Deny
        </Button>
      </Stack>
    </Stack>
  );
}
