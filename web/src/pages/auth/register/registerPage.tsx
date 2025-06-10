import {
  Divider,
  Text,
  Title,
} from '@mantine/core';
import styles from './registerPage.module.css';
import { Anchor } from '@/components/anchor/anchor';
import { paths } from '@/config/paths';
import { RegisterForm } from './RegisterForm';

export const RegisterPage = () => {
  return (
    <div className={styles.main}>
      <div className={styles.titleWrapper}>
        <Title className={styles.title}>Create your DSTK Account</Title>
        <Text className={styles.subtitle}>
          The easiest way to deploy machine learning models
        </Text>
      </div>

      <Divider label="OR" labelPosition="center" />

      <RegisterForm />

      <Text className={styles.login}>
        Already have an account?{' '}
        <Anchor to={paths.auth.login.path} size="sm">
          Log in
        </Anchor>
      </Text>
    </div>
  );
};
