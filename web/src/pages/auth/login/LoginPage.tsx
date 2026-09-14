import { Anchor } from "@/components/anchor/Anchor";
import { paths } from "@/config/paths";
import { AuthAccent, AuthBrand } from "@/features/auth/components/AuthBrand";
import { AuthCard, AuthFooterText } from "@/features/auth/components/AuthCard";

import { LoginForm } from "./LoginForm";

export function LoginPage() {
  return (
    <>
      <AuthBrand
        subtitle="The easiest way to version and ship machine learning models"
        title={(
          <>
            Sign in to
            {" "}
            <AuthAccent>DSTK</AuthAccent>
          </>
        )}
      />
      <AuthCard>
        <LoginForm />
      </AuthCard>
      <AuthFooterText>
        New to DSTK?
        {" "}
        <Anchor to={paths.auth.register.path}>Create an account</Anchor>
      </AuthFooterText>
    </>
  );
}
