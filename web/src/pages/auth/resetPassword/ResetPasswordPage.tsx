import { Navigate, useSearchParams } from "react-router";

import { Anchor } from "@/components/anchor/Anchor";
import { paths } from "@/config/paths";
import { AuthAccent, AuthBrand } from "@/features/auth/components/AuthBrand";
import { AuthCard, AuthFooterText } from "@/features/auth/components/AuthCard";

import { ResetPasswordForm } from "./ResetPasswordForm";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return <Navigate to={paths.auth.forgotPassword.path} />;
  }

  return (
    <>
      <AuthBrand
        subtitle="Pick a new password for your account"
        title={(
          <>
            Choose a new
            {" "}
            <AuthAccent>password</AuthAccent>
          </>
        )}
      />
      <AuthCard>
        <ResetPasswordForm token={token} />
      </AuthCard>
      <AuthFooterText>
        Link expired?
        {" "}
        <Anchor to={paths.auth.forgotPassword.path}>Request a new one</Anchor>
      </AuthFooterText>
    </>
  );
}
