import { useMutation } from '@apollo/client';
import {
  Button,
  Checkbox,
  Divider,
  Group,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { z } from 'zod/v4';

import type { LoginInput } from '@/graphql/types';

import { Anchor } from '@/components/anchor/Anchor';
import { GithubIcon } from '@/components/icons/github/GithubIcon';
import { GoogleIcon } from '@/components/icons/google/GoogleIcon';
import { paths } from '@/config/paths';
import { GET_USER } from '@/features/auth/loaders/authLoader';
import { LIST_TEAMS } from '@/features/teams/loaders/teamsLoader';
import { gql } from '@/graphql';

import styles from './LoginPage.module.css';

const LOGIN = gql(`
    mutation Login($data: LoginInput!) {
        login(data: $data)
    }
`);

const loginSchema = z.object({
  email: z
    .email({
      error: 'Please enter a valid email',
    })
    .min(1, 'Required'),
  password: z.string().min(1, 'Required'),
  rememberMe: z.boolean({ message: 'Required' }),
}) satisfies z.ZodType<LoginInput>;

type LoginSchema = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const [login, { loading }] = useMutation(LOGIN);

  const loginForm = useForm({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'uncontrolled',
    validate: zod4Resolver(loginSchema),
  });

  const onSubmit = (values: LoginSchema) =>
    login({
      refetchQueries: [{ query: GET_USER }, { query: LIST_TEAMS }],
      variables: {
        data: { ...values },
      },
    });

  return (
    <div className={styles.main}>
      <div className={styles.titleWrapper}>
        <Title className={styles.title}>Log in to your DSTK Account</Title>
        <Text className={styles.subtitle}>
          The easiest way to deploy machine learning models
        </Text>
      </div>

      <div className={styles.oauthButtonWrapper}>
        <Button
          disabled={loading}
          fullWidth
          leftSection={<GoogleIcon height={16} width={17} />}
          variant='default'
        >
          Sign in with Google
        </Button>
        <Button
          disabled={loading}
          fullWidth
          leftSection={<GithubIcon height={16} width={17} />}
          variant='default'
        >
          Sign in with Github
        </Button>
      </div>

      <Divider label='OR' labelPosition='center' />

      <form onSubmit={loginForm.onSubmit((values) => onSubmit(values))}>
        <TextInput
          disabled={loading}
          key={loginForm.key('email')}
          label='Email'
          placeholder='you@dstk.org'
          withAsterisk
          {...loginForm.getInputProps('email')}
        />
        <PasswordInput
          disabled={loading}
          key={loginForm.key('password')}
          label='Password'
          mt='md'
          placeholder='Shhhhhhh'
          withAsterisk
          {...loginForm.getInputProps('password')}
        />
        <Group justify='space-between' mt='lg'>
          <Checkbox
            disabled={loading}
            key={loginForm.key('rememberMe')}
            label='Remember me'
            {...loginForm.getInputProps('rememberMe', { type: 'checkbox' })}
          />
          <Anchor component='button' disabled={loading} size='sm'>
            Forgot password?
          </Anchor>
        </Group>
        <Button fullWidth loading={loading} mt='xl' type='submit'>
          Sign in
        </Button>
      </form>

      <Text className={styles.signUp}>
        New to DSTK?{' '}
        <Anchor size='sm' to={paths.auth.register.path}>
          Create account
        </Anchor>
      </Text>
    </div>
  );
};
