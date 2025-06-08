import { Anchor, Button, Checkbox, Divider, Group, PasswordInput, Text, TextInput, Title } from '@mantine/core';
import styles from './loginPage.module.css';
import { GoogleIcon } from '@/components/icons/google/googleIcon';
import { GithubIcon } from '@/components/icons/github/githubIcon';
import { gql } from '@/graphql';
import { z } from 'zod/v4';
import type { LoginInput } from '@/graphql/types';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useMutation } from '@apollo/client';
import { GET_USER } from '@/features/auth/loaders/authLoader';

const LOGIN = gql(`
    mutation Login($data: LoginInput!) {
        login(data: $data)
    }
`);

const loginSchema = z.object({
  email: z.email({
    error: 'Please enter a valid email',
  }).min(1, 'Required'),
  password: z.string().min(1, 'Required'),
  rememberMe: z.boolean({ 'message': 'Required' }),
}) satisfies z.ZodType<LoginInput>;

type LoginSchema = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const [login, { loading }] = useMutation(LOGIN);

  const loginForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: zod4Resolver(loginSchema),
  });

  const onSubmit = (values: LoginSchema) => login({
    variables: {
      data: { ...values }
    },
    refetchQueries: [{ query: GET_USER }],
  });

  return (
    <div className={styles.main}>

      <div className={styles.titleWrapper}>
        <Title className={styles.title}>Log in to your DSTK Account</Title>
        <Text className={styles.subtitle}>The easiest way to deploy machine learning models</Text>
      </div>

      <div className={styles.oauthButtonWrapper}>
        <Button disabled={loading} leftSection={<GoogleIcon height={16} width={17} />} variant='default' fullWidth>Sign in with Google</Button>
        <Button disabled={loading} leftSection={<GithubIcon height={16} width={17} />} variant='default' fullWidth>Sign in with Github</Button>
      </div>

      <Divider label='OR' labelPosition='center' />

      <form onSubmit={loginForm.onSubmit(values => onSubmit(values))}>
        <TextInput disabled={loading} label="Email" key={loginForm.key('email')} placeholder="you@mantine.dev" withAsterisk {...loginForm.getInputProps('email')} />
        <PasswordInput disabled={loading} label="Password" placeholder="Shhhhhhh" key={loginForm.key('password')} withAsterisk mt="md" {...loginForm.getInputProps('password')} />
        <Group justify="space-between" mt="lg">
          <Checkbox disabled={loading} label="Remember me" key={loginForm.key('rememberMe')} {...loginForm.getInputProps('rememberMe', { type: 'checkbox' })} />
          <Anchor component="button" disabled={loading} size="sm">
            Forgot password?
          </Anchor>
        </Group>
        <Button loading={loading} fullWidth mt="xl" type='submit'>
          Sign in
        </Button>
      </form>

      <Text className={styles.signUp}>
        New to DSTK? <Anchor size='sm'>Create account</Anchor>
      </Text>
    </div>
  );
};
