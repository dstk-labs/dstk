import {
  Text,
  Title,
} from "@mantine/core";
import { Anchor } from "@/components/anchor/Anchor";
import { paths } from "@/config/paths";
import { LoginForm } from "./LoginForm";
import styles from "./LoginPage.module.css";

export function LoginPage() {
  return (
    <div className={styles.main}>
      <div className={styles.titleWrapper}>
        <Title className={styles.title}>Log in to your DSTK Account</Title>
        <Text className={styles.subtitle}>
          The easiest way to deploy machine learning models
        </Text>
      </div>

      <LoginForm />

      <Text className={styles.signUp}>
        New to DSTK?
        {" "}
        <Anchor size="sm" to={paths.auth.register.path}>
          Create account
        </Anchor>
      </Text>
    </div>
  );
}
