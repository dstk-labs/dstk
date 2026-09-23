import type { RequestPasswordResetInput } from "@/graphql/types";
import { useMutation } from "@apollo/client";
import { Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import { useNavigate } from "react-router";
import { z } from "zod/v4";

import { paths } from "@/config/paths";
import { AuthStatus } from "@/features/auth/components/AuthStatus";
import { gql } from "@/graphql";

const REQUEST_PASSWORD_RESET = gql(`
    mutation RequestPasswordReset($data: RequestPasswordResetInput!) {
      requestPasswordReset(data: $data)
    }
`);

const forgotPasswordSchema = z.object({
  email: z
    .email({
      error: "Please enter a valid email",
    })
    .min(1, "Required"),
}) satisfies z.ZodType<RequestPasswordResetInput>;

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [requestPasswordReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET);
  const [sentTo, setSentTo] = useState<null | string>(null);

  const form = useForm({
    initialValues: {
      email: "",
    },
    mode: "uncontrolled",
    validate: zod4Resolver(forgotPasswordSchema),
  });

  const onSubmit = (values: ForgotPasswordSchema) =>
    requestPasswordReset({
      variables: {
        data: { ...values },
      },
      onCompleted: () => setSentTo(values.email),
    });

  if (sentTo) {
    return (
      <AuthStatus
        actions={(
          <Button fullWidth onClick={() => navigate(paths.auth.login.path)}>
            Back to sign in
          </Button>
        )}
        subtitle={`If an account exists for ${sentTo}, a reset link is on its way.`}
        title="Check your email"
        tone="info"
      />
    );
  }

  return (
    <form onSubmit={form.onSubmit(values => onSubmit(values))}>
      <Stack gap="lg">
        <TextInput
          autoComplete="email"
          disabled={loading}
          key={form.key("email")}
          label="Email"
          placeholder="you@company.com"
          type="email"
          {...form.getInputProps("email")}
        />
        <Button fullWidth loading={loading} type="submit">
          Send reset link
        </Button>
      </Stack>
    </form>
  );
}
