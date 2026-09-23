import { Anchor } from "@/components/anchor/Anchor";
import { paths } from "@/config/paths";
import { AuthAccent, AuthBrand } from "@/features/auth/components/AuthBrand";
import { AuthCard, AuthFooterText } from "@/features/auth/components/AuthCard";

import { ForgotPasswordForm } from "./ForgotPasswordForm";

export function ForgotPasswordPage() {
  return (
    <>
      <AuthBrand
        subtitle="Enter the email on your account and we'll send you a link to reset your password"
        title={(
          <>
            Reset your
            {" "}
            <AuthAccent>password</AuthAccent>
          </>
        )}
      />
      <AuthCard>
        <ForgotPasswordForm />
      </AuthCard>
      <AuthFooterText>
        Remembered it?
        {" "}
        <Anchor to={paths.auth.login.path}>Back to sign in</Anchor>
      </AuthFooterText>
    </>
  );
}
