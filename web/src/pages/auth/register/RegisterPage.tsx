import { Anchor } from "@/components/anchor/Anchor";
import { paths } from "@/config/paths";
import { AuthAccent, AuthBrand } from "@/features/auth/components/AuthBrand";
import { AuthCard, AuthFooterText } from "@/features/auth/components/AuthCard";

import { RegisterForm } from "./RegisterForm";

export function RegisterPage() {
  return (
    <>
      <AuthBrand
        subtitle="Get started for free. No credit card required."
        title={(
          <>
            Create your
            {" "}
            <AuthAccent>DSTK</AuthAccent>
            {" "}
            account
          </>
        )}
      />
      <AuthCard>
        <RegisterForm />
      </AuthCard>
      <AuthFooterText>
        Already have an account?
        {" "}
        <Anchor to={paths.auth.login.path}>Sign in</Anchor>
      </AuthFooterText>
      <p
        style={{
          color: "var(--color-text-muted)",
          fontSize: "var(--font-size-3xs)",
          lineHeight: "var(--leading-normal)",
          margin: "var(--space-4) 0 0",
          textAlign: "center",
        }}
      >
        By creating an account, you agree to the DSTK
        {" "}
        <Anchor c="var(--color-text-secondary)" size="xs" to={paths.root.terms.path} underline="always">
          Terms
        </Anchor>
        {" "}
        and
        {" "}
        <Anchor c="var(--color-text-secondary)" size="xs" to={paths.root.privacy.path} underline="always">
          Privacy Policy
        </Anchor>
        .
      </p>
    </>
  );
}
