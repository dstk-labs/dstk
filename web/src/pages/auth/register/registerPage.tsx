import { Button, Divider, PasswordInput, Text, TextInput, Title } from '@mantine/core';
import styles from './registerPage.module.css';
import { GoogleIcon } from '@/components/icons/google/googleIcon';
import { GithubIcon } from '@/components/icons/github/githubIcon';
import { z } from 'zod/v4';
import type { AccountInput } from '@/graphql/types';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useMutation } from '@apollo/client';
import { GET_USER } from '@/features/auth/loaders/authLoader';
import { gql } from '@/graphql';
import { Anchor } from '@/components/anchor/anchor';
import { paths } from '@/config/paths';

const CREATE_ACCOUNT = gql(`
    mutation CreateAccount($data: AccountInput!) {
      createAccount(data: $data) {
        userId
      }
    }
`);

const registerSchema = z.object({
  confirmPassword: z.string().min(1, 'Required'),
  email: z.email({
    error: 'Please enter a valid email',
  }).min(1, 'Required'),
  password: z.string().min(1, 'Required'),
  realName: z.string().min(1, 'Required'),
  userName: z.string().min(1, 'Required'),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: 'custom',
      message: 'Passwords must match',
      path: ['confirmPassword']
    });
  }
}) satisfies z.ZodType<AccountInput>;

type RegisterSchema = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const [register, { loading }] = useMutation(CREATE_ACCOUNT);

  const registerForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      confirmPassword: '',
      email: '',
      password: '',
      realName: '',
      userName: '',
    },
    validate: zod4Resolver(registerSchema),
  });

  const onSubmit = (values: RegisterSchema) => register({
    variables: {
      data: {
        email: values.email,
        password: values.password,
        realName: values.realName,
        userName: values.userName,
      }
    },
    refetchQueries: [{ query: GET_USER }],
  });

  return (
    <div className={styles.main}>

      <div className={styles.titleWrapper}>
        <Title className={styles.title}>Create your DSTK Account</Title>
        <Text className={styles.subtitle}>The easiest way to deploy machine learning models</Text>
      </div>

      <div className={styles.oauthButtonWrapper}>
        <Button disabled={loading} leftSection={<GoogleIcon height={16} width={17} />} variant='default' fullWidth>Register with Google</Button>
        <Button disabled={loading} leftSection={<GithubIcon height={16} width={17} />} variant='default' fullWidth>Register with Github</Button>
      </div>

      <Divider label='OR' labelPosition='center' />

      <form onSubmit={registerForm.onSubmit(values => onSubmit(values))}>
        <TextInput disabled={loading} label="Name" key={registerForm.key('realName')} placeholder="Your name" withAsterisk {...registerForm.getInputProps('realName')} />
        <TextInput disabled={loading} label="Username" key={registerForm.key('userName')} mt='md' placeholder="Your username" withAsterisk {...registerForm.getInputProps('userName')} />
        <Divider my='lg' />
        <TextInput disabled={loading} label="Email" key={registerForm.key('email')} placeholder="you@dstk.dev" withAsterisk {...registerForm.getInputProps('email')} />
        <Divider my='lg' />
        <PasswordInput disabled={loading} label="Password" placeholder="Shhhhhhh" key={registerForm.key('password')} withAsterisk {...registerForm.getInputProps('password')} />
        <PasswordInput disabled={loading} label="Confirm Password" placeholder="Also Shhhhhhh" key={registerForm.key('confirmPassword')} mt='md' withAsterisk {...registerForm.getInputProps('confirmPassword')} />
        <Button loading={loading} fullWidth mt="xl" type='submit'>
          Register
        </Button>
      </form>

      <Text className={styles.login}>
        Already have an account? <Anchor to={paths.auth.login.path} size='sm'>Log in</Anchor>
      </Text>
    </div>
  );
};
