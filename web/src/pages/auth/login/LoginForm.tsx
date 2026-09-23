import type { LoginInput } from "@/graphql/types";
import { useMutation } from "@apollo/client";
import {
  Button,
  Checkbox,
  Group,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useNavigate } from "react-router";
import { z } from "zod/v4";

import { Anchor } from "@/components/anchor/Anchor";
import { paths } from "@/config/paths";
import { OAuthButtons } from "@/features/auth/components/OAuthButtons";
import { useGithubOAuth, useGoogleOAuth } from "@/features/auth/hooks/oauthHooks";
import { GET_USER } from "@/features/auth/loaders/authLoader";
import { LIST_TEAMS_FOR_DROPDOWN } from "@/features/teams/loaders/teamsLoader";
import { gql } from "@/graphql";

const LOGIN = gql(`
    mutation Login($data: LoginInput!) {
        login(data: $data) {
            isTwoFactorRequired
        }
    }
`);

const loginSchema = z.object({
  email: z
    .email({
      error: "Please enter a valid email",
    })
    .min(1, "Required"),
  password: z.string().min(1, "Required"),
  rememberMe: z.boolean({ message: "Required" }),
}) satisfies z.ZodType<LoginInput>;

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [login, { loading: loginLoading }] = useMutation(LOGIN);

  const { redirect: loginWithGoogle, loading: googleLoading } = useGoogleOAuth();
  const { redirect: loginWithGithub, loading: githubLoading } = useGithubOAuth();

  const loading = loginLoading || googleLoading || githubLoading;
  const navigate = useNavigate();

  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
    mode: "uncontrolled",
    validate: zod4Resolver(loginSchema),
  });

  const onSubmit = (values: LoginSchema) =>
    login({
      refetchQueries: [{ query: GET_USER }, { query: LIST_TEAMS_FOR_DROPDOWN }],
      variables: {
        data: { ...values },
      },
      onCompleted: (data) => {
        if (data.login?.isTwoFactorRequired) {
          navigate(paths.auth.twoFactor.path);
          return;
        }

        navigate(paths.dashboard.overview.path);
      },
    });

  return (
    <>
      <OAuthButtons
        disabled={loading}
        onGithub={loginWithGithub}
        onGoogle={loginWithGoogle}
        verb="Continue"
      />

      <form onSubmit={loginForm.onSubmit(values => onSubmit(values))}>
        <Stack gap="lg">
          <TextInput
            autoComplete="email"
            disabled={loading}
            key={loginForm.key("email")}
            label="Email"
            placeholder="you@company.com"
            type="email"
            {...loginForm.getInputProps("email")}
          />
          <PasswordInput
            autoComplete="current-password"
            disabled={loading}
            key={loginForm.key("password")}
            label="Password"
            placeholder="Your password"
            {...loginForm.getInputProps("password")}
          />
          <Group justify="space-between">
            <Checkbox
              disabled={loading}
              key={loginForm.key("rememberMe")}
              label="Remember Me"
              {...loginForm.getInputProps("rememberMe", { type: "checkbox" })}
            />
            <Anchor component="button" disabled={loading} size="xs" type="button">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth loading={loading} type="submit">
            Sign in
          </Button>
        </Stack>
      </form>
    </>
  );
}
