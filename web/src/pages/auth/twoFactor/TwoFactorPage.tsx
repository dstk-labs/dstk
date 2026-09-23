import { Navigate } from "react-router";

import { paths } from "@/config/paths";
import { AuthAccent, AuthBrand } from "@/features/auth/components/AuthBrand";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { useUser } from "@/features/auth/hooks/authHooks";

import { TwoFactorForm } from "./TwoFactorForm";

export function TwoFactorPage() {
  const { user } = useUser();

  if (user) {
    return <Navigate to={paths.dashboard.overview.path} />;
  }

  return (
    <>
      <AuthBrand
        title={(
          <>
            Verify it's
            {" "}
            <AuthAccent>you</AuthAccent>
          </>
        )}
      />
      <AuthCard>
        <TwoFactorForm />
      </AuthCard>
    </>
  );
}
