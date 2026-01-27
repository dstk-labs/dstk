import type { AccountInput } from "@/graphql/types";
import { useMutation } from "@apollo/client";
import {
  Button,
  CheckIcon,
  Divider,
  PasswordInput,
  Radio,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import { useNavigate } from "react-router";
import { z } from "zod/v4";
import { GithubIcon } from "@/components/icons/github/GitHubIcon";
import { GoogleIcon } from "@/components/icons/google/GoogleIcon";
import { paths } from "@/config/paths";
import { useGoogleOAuth } from "@/features/auth/hooks/oauthHooks";
import { GET_USER } from "@/features/auth/loaders/authLoader";
import {
  LIST_TEAMS_FOR_DROPDOWN,
  LIST_TEAMS_FOR_TABLE,
} from "@/features/teams/loaders/teamsLoader";
import { gql } from "@/graphql";
import styles from "./RegisterForm.module.css";

const CREATE_ACCOUNT = gql(`
    mutation CreateAccount($data: AccountInput!) {
      createAccount(data: $data) {
        userId
      }
    }
`);

const passwordRules = [
  {
    message: "Password must be at least 12 characters long",
    name: "length",
    test: (val: string) => val.length >= 12,
  },
  {
    message: "Password must include at least one lowercase letter",
    name: "lowercase",
    test: (val: string) => /[a-z]/.test(val),
  },
  {
    message: "Password must include at least one uppercase letter",
    name: "uppercase",
    test: (val: string) => /[A-Z]/.test(val),
  },
  {
    message: "Password must include at least one number",
    name: "number",
    test: (val: string) => /\d/.test(val),
  },
  {
    message: "Password must include at least one symbol",
    name: "symbol",
    test: (val: string) => /[^A-Z0-9]/i.test(val),
  },
] as const;

const registerSchema = z
  .object({
    confirmPassword: z.string().min(1, "Required"),
    email: z
      .email({
        error: "Please enter a valid email",
      })
      .min(1, "Required"),
    password: passwordRules.reduce(
      (schema, rule) =>
        schema.refine(rule.test, {
          message: rule.message,
        }),
      z.string(),
    ),
    realName: z.string().min(1, "Required"),
    userName: z.string().min(1, "Required"),
  })
  .check((ctx) => {
    if (ctx.value.confirmPassword !== ctx.value.password) {
      ctx.issues.push({
        code: "custom",
        input: ctx.value.confirmPassword,
        message: "Passwords must match",
      });
    }
  }) satisfies z.ZodType<AccountInput>;

type RegisterSchema = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const navigate = useNavigate();
  const [register, { loading: registerLoading }] = useMutation(CREATE_ACCOUNT);

  const { redirect: registerWithGoogle, loading: googleLoading } = useGoogleOAuth();

  const loading = registerLoading || googleLoading;
  const [password, setPassword] = useState("");

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

  const getPasswordValidationState = (password: string) => {
    return Object.fromEntries(
      passwordRules.map(rule => [rule.name, rule.test(password)]),
    );
  };

  const passwordChecks = getPasswordValidationState(password);

  const onSubmit = (values: RegisterSchema) =>
    register({
      refetchQueries: [
        { query: GET_USER },
        { query: LIST_TEAMS_FOR_DROPDOWN },
        { query: LIST_TEAMS_FOR_TABLE },
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
      <div className={styles.oauthButtonWrapper}>
        <Button
          disabled={loading}
          onClick={registerWithGoogle}
          fullWidth
          leftSection={<GoogleIcon height={16} width={17} />}
          variant="default"
        >
          Register with Google
        </Button>
        <Button
          disabled={loading}
          fullWidth
          leftSection={<GithubIcon height={16} width={17} />}
          variant="default"
        >
          Register with Github
        </Button>
      </div>
      <form onSubmit={registerForm.onSubmit(values => onSubmit(values))}>
        <TextInput
          disabled={loading}
          key={registerForm.key("realName")}
          label="Name"
          placeholder="Your name"
          withAsterisk
          {...registerForm.getInputProps("realName")}
        />
        <TextInput
          disabled={loading}
          key={registerForm.key("userName")}
          label="Username"
          mt="md"
          placeholder="Your username"
          withAsterisk
          {...registerForm.getInputProps("userName")}
        />
        <Divider my="lg" />
        <TextInput
          disabled={loading}
          key={registerForm.key("email")}
          label="Email"
          placeholder="you@dstk.org"
          withAsterisk
          {...registerForm.getInputProps("email")}
        />
        <Divider my="lg" />
        <PasswordInput
          disabled={loading}
          key={registerForm.key("password")}
          label="Password"
          mb="md"
          placeholder="Shhhhhhh"
          withAsterisk
          {...registerForm.getInputProps("password")}
          onChange={(event) => {
            const val = event.currentTarget.value;
            setPassword(val);
            registerForm.setFieldValue("password", val);
          }}
          value={password}
        />
        <Stack>
          {passwordRules.map(({ message, name }) => (
            <Radio
              checked={passwordChecks[name]}
              color="green"
              icon={CheckIcon}
              key={name}
              label={message}
              size="xs"
            />
          ))}
        </Stack>
        <PasswordInput
          disabled={loading}
          key={registerForm.key("confirmPassword")}
          label="Confirm Password"
          mt="md"
          placeholder="Also Shhhhhhh"
          withAsterisk
          {...registerForm.getInputProps("confirmPassword")}
        />
        <Button fullWidth loading={loading} mt="xl" type="submit">
          Register
        </Button>
      </form>
    </>
  );
}
