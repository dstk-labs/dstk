import { useMutation } from "@apollo/client";
import { Button, PasswordInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useNavigate } from "react-router";
import { z } from "zod/v4";

import { paths } from "@/config/paths";
import { PasswordStrength } from "@/features/auth/components/PasswordStrength";
import { passwordRules, passwordSchema } from "@/features/auth/utils/passwordRules";
import { gql } from "@/graphql";

const RESET_PASSWORD = gql(`
    mutation ResetPassword($data: ResetPasswordInput!) {
      resetPassword(data: $data)
    }
`);

const resetPasswordSchema = z
  .object({
    confirmPassword: z.string().min(1, "Required"),
    password: passwordSchema,
  })
  .check((ctx) => {
    if (ctx.value.confirmPassword !== ctx.value.password) {
      ctx.issues.push({
        code: "custom",
        input: ctx.value.confirmPassword,
        message: "Passwords must match",
        path: ["confirmPassword"],
      });
    }
  });

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const navigate = useNavigate();
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);

  const form = useForm({
    initialValues: {
      confirmPassword: "",
      password: "",
    },
    mode: "controlled",
    validate: zod4Resolver(resetPasswordSchema),
  });

  const onSubmit = (values: ResetPasswordSchema) =>
    resetPassword({
      variables: {
        data: {
          newPassword: values.password,
          token,
        },
      },
      onCompleted: () => {
        notifications.show({
          color: "green",
          message: "Sign in with your new password.",
          title: "Password updated",
        });
        navigate(paths.auth.login.path);
      },
    });

  return (
    <form onSubmit={form.onSubmit(values => onSubmit(values))}>
      <Stack gap="lg">
        <div>
          <PasswordInput
            autoComplete="new-password"
            disabled={loading}
            label="New password"
            placeholder="Minimum 12 characters"
            {...form.getInputProps("password")}
            error={undefined}
          />
          <PasswordStrength
            password={form.values.password}
            rules={passwordRules}
          />
        </div>
        <PasswordInput
          autoComplete="new-password"
          disabled={loading}
          label="Confirm new password"
          placeholder="Re-enter your new password"
          {...form.getInputProps("confirmPassword")}
        />
        <Button fullWidth loading={loading} type="submit">
          Update password
        </Button>
      </Stack>
    </form>
  );
}
