import { Navigate, useLocation, useParams } from "react-router";

import { paths } from "@/config/paths";
import { AuthBrand } from "@/features/auth/components/AuthBrand";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { useUser } from "@/features/auth/hooks/authHooks";
import { AuthShell } from "@/layouts/auth/AuthShell";

import { InvitationRequest } from "./InvitationRequest";

export function InvitationPage() {
  const { user } = useUser();
  const { pathname } = useLocation();
  const { invitationId = "" } = useParams();

  if (!user) {
    return <Navigate to={paths.auth.login.getPath(pathname)} />;
  }

  if (!user.isEmailVerified) {
    return <Navigate to={paths.auth.verify.path} />;
  }

  return (
    <AuthShell>
      <AuthBrand subtitle="Join your team on DSTK" title="Team invitation" />
      <AuthCard>
        <InvitationRequest invitationId={invitationId} userEmail={user.email} />
      </AuthCard>
    </AuthShell>
  );
}
