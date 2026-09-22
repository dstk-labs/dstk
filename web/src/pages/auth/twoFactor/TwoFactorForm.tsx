import { useMutation } from "@apollo/client";
import {
  Button,
  Checkbox,
  Group,
  PinInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { z } from "zod/v4";

import { Anchor } from "@/components/anchor/Anchor";
import { paths } from "@/config/paths";
import { GET_USER } from "@/features/auth/loaders/authLoader";
import { LIST_TEAMS_FOR_DROPDOWN } from "@/features/teams/loaders/teamsLoader";
import { gql } from "@/graphql";

const VERIFY_TOTP = gql(`
  mutation VerifyTotp($data: TwoFactorCodeInput!) {
    verifyTotp(data: $data)
  }
`);

const VERIFY_TWO_FACTOR_OTP = gql(`
  mutation VerifyTwoFactorOtp($data: TwoFactorCodeInput!) {
    verifyTwoFactorOtp(data: $data)
  }
`);

const VERIFY_BACKUP_CODE = gql(`
  mutation VerifyBackupCode($data: TwoFactorCodeInput!) {
    verifyBackupCode(data: $data)
  }
`);

const SEND_TWO_FACTOR_OTP = gql(`
  mutation SendTwoFactorOtp {
    sendTwoFactorOtp
  }
`);

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

const digitCodeSchema = z.object({
  code: z.string().length(CODE_LENGTH, `Enter all ${CODE_LENGTH} digits`),
  trustDevice: z.boolean(),
});

const backupCodeSchema = z.object({
  code: z.string().min(1, "Required"),
  trustDevice: z.boolean(),
});

type Method = "backup" | "otp" | "totp";

const PROMPTS = {
  backup: "Enter one of the backup codes you saved when you turned on two-factor authentication.",
  otp: "A code has been sent to your email",
  totp: "Finish using your authenticator app",
};

export function TwoFactorForm() {
  const [method, setMethod] = useState<Method>("totp");
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  const [verifyTotp, { loading: totpLoading }] = useMutation(VERIFY_TOTP);
  const [verifyOtp, { loading: otpLoading }] = useMutation(VERIFY_TWO_FACTOR_OTP);
  const [verifyBackupCode, { loading: backupLoading }] = useMutation(VERIFY_BACKUP_CODE);
  const [sendOtp, { loading: sendLoading }] = useMutation(SEND_TWO_FACTOR_OTP);

  const loading = totpLoading || otpLoading || backupLoading || sendLoading;

  const form = useForm({
    initialValues: {
      code: "",
      trustDevice: false,
    },
    validate: zod4Resolver(method === "backup" ? backupCodeSchema : digitCodeSchema),
  });

  useEffect(() => {
    if (cooldown === 0) {
      return;
    }

    const timer = setInterval(() => setCooldown(seconds => Math.max(seconds - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const verify = {
    backup: verifyBackupCode,
    otp: verifyOtp,
    totp: verifyTotp,
  }[method];

  const onSubmit = (values: typeof form.values) =>
    verify({
      onCompleted: () => navigate(paths.dashboard.overview.path),
      onError: () => form.setFieldValue("code", ""),
      refetchQueries: [{ query: GET_USER }, { query: LIST_TEAMS_FOR_DROPDOWN }],
      variables: {
        data: { ...values },
      },
    });

  const onEmailCode = () =>
    sendOtp({
      onCompleted: () => {
        setMethod("otp");
        setCooldown(RESEND_COOLDOWN_SECONDS);
        form.setFieldValue("code", "");
      },
      onError: () => setCooldown(0),
    });

  const switchMethod = (next: Method) => {
    setMethod(next);
    form.setFieldValue("code", "");
  };

  return (
    <form onSubmit={form.onSubmit(values => onSubmit(values))}>
      <Stack gap="lg">
        <Text c="var(--color-text-secondary)" fw={300} size="sm">
          {PROMPTS[method]}
        </Text>

        {method === "backup"
          ? (
              <TextInput
                autoComplete="one-time-code"
                disabled={loading}
                label="Backup code"
                placeholder="Paste a backup code"
                {...form.getInputProps("code")}
              />
            )
          : (
              <PinInput
                aria-label="Verification code"
                disabled={loading}
                length={CODE_LENGTH}
                oneTimeCode
                type="number"
                {...form.getInputProps("code")}
              />
            )}

        <Checkbox
          disabled={loading}
          label="Trust this device for 30 days"
          {...form.getInputProps("trustDevice", { type: "checkbox" })}
        />

        <Button fullWidth loading={loading} type="submit">
          Verify
        </Button>

        <Group gap="md" justify="center">
          {method !== "otp" && (
            <Anchor
              component="button"
              disabled={loading}
              onClick={onEmailCode}
              size="xs"
              type="button"
            >
              Email me a code instead
            </Anchor>
          )}
          {method === "otp" && (
            <Anchor
              component="button"
              disabled={loading || cooldown > 0}
              onClick={onEmailCode}
              size="xs"
              type="button"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
            </Anchor>
          )}
          {method !== "totp" && (
            <Anchor
              component="button"
              disabled={loading}
              onClick={() => switchMethod("totp")}
              size="xs"
              type="button"
            >
              Use your authenticator app
            </Anchor>
          )}
          {method !== "backup" && (
            <Anchor
              component="button"
              disabled={loading}
              onClick={() => switchMethod("backup")}
              size="xs"
              type="button"
            >
              Use a backup code
            </Anchor>
          )}
        </Group>
      </Stack>
    </form>
  );
}
