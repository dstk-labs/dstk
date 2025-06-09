import {
  Button,
  Divider,
  PasswordInput,
  Radio,
  Stack,
  TextInput,
} from '@mantine/core';
import styles from './RegisterForm.module.css';
import { GoogleIcon } from '@/components/icons/google/googleIcon';
import { GithubIcon } from '@/components/icons/github/githubIcon';
import { z } from 'zod/v4';
import type { AccountInput } from '@/graphql/types';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useMutation } from '@apollo/client';
import { GET_USER } from '@/features/auth/loaders/authLoader';
import { gql } from '@/graphql';
import { useState } from 'react';

const CREATE_ACCOUNT = gql(`
    mutation CreateAccount($data: AccountInput!) {
      createAccount(data: $data) {
        userId
      }
    }
`);

const passwordRules = [
  {
    name: 'length',
    message: 'Password must be at least 12 characters long',
    test: (val: string) => val.length >= 12,
  },
  {
    name: 'lowercase',
    message: 'Password must include at least one lowercase letter',
    test: (val: string) => /[a-z]/.test(val),
  },
  {
    name: 'uppercase',
    message: 'Password must include at least one uppercase letter',
    test: (val: string) => /[A-Z]/.test(val),
  },
  {
    name: 'number',
    message: 'Password must include at least one number',
    test: (val: string) => /[0-9]/.test(val),
  },
  {
    name: 'symbol',
    message: 'Password must include at least one symbol',
    test: (val: string) => /[^A-Za-z0-9]/.test(val),
  },
] as const;

const registerSchema = z
  .object({
    confirmPassword: z.string().min(1, 'Required'),
    email: z
      .email({
        error: 'Please enter a valid email',
      })
      .min(1, 'Required'),
    password: passwordRules.reduce(
      (schema, rule) =>
        schema.refine(rule.test, {
          message: rule.message,
        }),
      z.string()
    ),
    realName: z.string().min(1, 'Required'),
    userName: z.string().min(1, 'Required'),
  })
  .check((ctx) => {
    if (ctx.value.confirmPassword !== ctx.value.password) {
      ctx.issues.push({
        code: 'custom',
        message: 'Passwords must match',
        input: ctx.value.confirmPassword,
      });
    }
  }) satisfies z.ZodType<AccountInput>;

type RegisterSchema = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const [register, { loading }] = useMutation(CREATE_ACCOUNT);

  const [password, setPassword] = useState('');

  const registerForm = useForm({
    mode: 'controlled',
    initialValues: {
      confirmPassword: '',
      email: '',
      password: '',
      realName: '',
      userName: '',
    },
    validate: zod4Resolver(registerSchema),
  });

  const getPasswordValidationState = (password: string) => {
    return Object.fromEntries(
      passwordRules.map((rule) => [rule.name, rule.test(password)])
    );
  };

  const passwordChecks = getPasswordValidationState(password);

  const onSubmit = (values: RegisterSchema) =>
    register({
      variables: {
        data: {
          email: values.email,
          password: values.password,
          realName: values.realName,
          userName: values.userName,
        },
      },
      refetchQueries: [{ query: GET_USER }],
    });
    
  return (
    <>
      <div className={styles.oauthButtonWrapper}>
        <Button
          disabled={loading}
          leftSection={<GoogleIcon height={16} width={17} />}
          variant="default"
          fullWidth
        >
          Register with Google
        </Button>
        <Button
          disabled={loading}
          leftSection={<GithubIcon height={16} width={17} />}
          variant="default"
          fullWidth
        >
          Register with Github
        </Button>
      </div>
      <form onSubmit={registerForm.onSubmit((values) => onSubmit(values))}>
        <TextInput
          disabled={loading}
          label="Name"
          key={registerForm.key('realName')}
          placeholder="Your name"
          withAsterisk
          {...registerForm.getInputProps('realName')}
        />
        <TextInput
          disabled={loading}
          label="Username"
          key={registerForm.key('userName')}
          mt="md"
          placeholder="Your username"
          withAsterisk
          {...registerForm.getInputProps('userName')}
        />
        <Divider my="lg" />
        <TextInput
          disabled={loading}
          label="Email"
          key={registerForm.key('email')}
          placeholder="you@dstk.dev"
          withAsterisk
          {...registerForm.getInputProps('email')}
        />
        <Divider my="lg" />
        <PasswordInput
          disabled={loading}
          label="Password"
          mb="md"
          placeholder="Shhhhhhh"
          key={registerForm.key('password')}
          withAsterisk
          {...registerForm.getInputProps('password')}
          value={password}
          onChange={(event) => {
            const val = event.currentTarget.value;
            setPassword(val);
            registerForm.setFieldValue('password', val);
          }}
        />
        <Stack>
          {passwordRules.map(({ name, message }) => (
            <Radio
              key={name}
              checked={passwordChecks[name]}
              label={message}
              size="xs"
            />
          ))}
        </Stack>
        <PasswordInput
          disabled={loading}
          label="Confirm Password"
          placeholder="Also Shhhhhhh"
          key={registerForm.key('confirmPassword')}
          mt="md"
          withAsterisk
          {...registerForm.getInputProps('confirmPassword')}
        />
        <Button loading={loading} fullWidth mt="xl" type="submit">
          Register
        </Button>
      </form>
    </>
  );
};
