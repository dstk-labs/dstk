import { Divider, Text, Title } from "@mantine/core";

import { Anchor } from "@/components/anchor/Anchor";
import { paths } from "@/config/paths";

import { RegisterForm } from "./RegisterForm";
import styles from "./RegisterPage.module.css";

export function RegisterPage() {
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
        Already have an account?
        {" "}
        <Anchor size="sm" to={paths.auth.login.path}>
          Log in
        </Anchor>
      </Text>
    </div>
  );
}
