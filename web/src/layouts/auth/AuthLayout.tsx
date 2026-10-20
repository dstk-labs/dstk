import { Navigate, Outlet, useLocation } from "react-router";

import { paths } from "@/config/paths";
import { useUser } from "@/features/auth/hooks/authHooks";
import { useRedirectTo } from "@/features/auth/hooks/redirectHooks";

import { AuthShell } from "./AuthShell";

const UNVERIFIED_PATHS: string[] = [
  paths.auth.verify.path,
  paths.auth.verifyEmail.path,
];

export function AuthLayout() {
  const { user } = useUser();
  const { pathname } = useLocation();
  const { destination } = useRedirectTo();
  const isPasswordReset = pathname === paths.auth.resetPassword.path;

  if (user?.isEmailVerified && !isPasswordReset) {
    return <Navigate to={destination} />;
  }

  if (user && !isPasswordReset && !UNVERIFIED_PATHS.includes(pathname)) {
    return <Navigate to={paths.auth.verify.path} />;
  }

  return (
    <AuthShell>
      <Outlet />
    </AuthShell>
  );
}
