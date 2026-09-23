import type { AccountInput } from "@/graphql/types";
import { useMutation } from "@apollo/client";
import {
  Button,
  Group,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useNavigate } from "react-router";
import { z } from "zod/v4";

import { paths } from "@/config/paths";
import { OAuthButtons } from "@/features/auth/components/OAuthButtons";
import { PasswordStrength } from "@/features/auth/components/PasswordStrength";
import { useGithubOAuth, useGoogleOAuth } from "@/features/auth/hooks/oauthHooks";
import { GET_USER } from "@/features/auth/loaders/authLoader";
import { passwordRules, passwordSchema } from "@/features/auth/utils/passwordRules";
import { LIST_TEAMS_FOR_DROPDOWN } from "@/features/teams/loaders/teamsLoader";
import { gql } from "@/graphql";

const CREATE_ACCOUNT = gql(`
    mutation CreateAccount($data: AccountInput!) {
      createAccount(data: $data) {
        userId
      }
    }
`);

const registerSchema = z
  .object({
    confirmPassword: z.string().min(1, "Required"),
    email: z
      .email({
        error: "Please enter a valid email",
      })
      .min(1, "Required"),
    password: passwordSchema,
    realName: z.string().min(1, "Required"),
    userName: z.string().min(1, "Required"),
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
  }) satisfies z.ZodType<AccountInput>;

type RegisterSchema = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const navigate = useNavigate();
  const [register, { loading: registerLoading }] = useMutation(CREATE_ACCOUNT);

  const { redirect: registerWithGoogle, loading: googleLoading } = useGoogleOAuth();
  const { redirect: registerWithGithub, loading: githubLoading } = useGithubOAuth();

  const loading = registerLoading || googleLoading || githubLoading;

  const registerForm = useForm({
    initialValues: {
      confirmPassword: "",
      email: "",
      password: "",
      realName: "",
      userName: "",
    },
    mode: "controlled",
    validate: zod4Resolver(registerSchema),
  });

  const onSubmit = (values: RegisterSchema) =>
    register({
      refetchQueries: [
        { query: GET_USER },
        { query: LIST_TEAMS_FOR_DROPDOWN },
      ],
      variables: {
        data: {
          email: values.email,
          password: values.password,
          realName: values.realName,
          userName: values.userName,
        },
      },
      onCompleted: () => navigate(paths.dashboard.overview.path),
    });

  return (
    <>
      <OAuthButtons
        disabled={loading}
        onGithub={registerWithGithub}
        onGoogle={registerWithGoogle}
        verb="Continue"
      />
      <form onSubmit={registerForm.onSubmit(values => onSubmit(values))}>
        <Stack gap="lg">
          <Group grow>
            <TextInput
              autoComplete="name"
              disabled={loading}
              label="Name"
              placeholder="Jane Doe"
              {...registerForm.getInputProps("realName")}
            />
            <TextInput
              autoComplete="username"
              disabled={loading}
              label="Username"
              placeholder="janedoe"
              {...registerForm.getInputProps("userName")}
            />
          </Group>
          <TextInput
            autoComplete="email"
            disabled={loading}
            label="Work Email"
            placeholder="you@company.com"
            type="email"
            {...registerForm.getInputProps("email")}
          />
          <div>
            <PasswordInput
              autoComplete="new-password"
              disabled={loading}
              label="Password"
              placeholder="Minimum 12 characters"
              {...registerForm.getInputProps("password")}
              error={undefined}
            />
            <PasswordStrength
              password={registerForm.values.password}
              rules={passwordRules}
            />
          </div>
          <PasswordInput
            autoComplete="new-password"
            disabled={loading}
            label="Confirm Password"
            placeholder="Re-enter your password"
            {...registerForm.getInputProps("confirmPassword")}
          />
          <Button fullWidth loading={loading} type="submit">
            Create account
          </Button>
        </Stack>
      </form>
    </>
  );
}
