import { Navigate, useLocation, useSearchParams } from "react-router";

import { paths } from "@/config/paths";
import { AuthBrand } from "@/features/auth/components/AuthBrand";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { useUser } from "@/features/auth/hooks/authHooks";
import { AuthShell } from "@/layouts/auth/AuthShell";

import { DeviceCodeForm } from "./DeviceCodeForm";
import { DeviceRequest } from "./DeviceRequest";

const USER_CODE_PARAM = "user_code";

export function DevicePage() {
  const { user } = useUser();
  const { pathname, search } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const userCode = searchParams.get(USER_CODE_PARAM);

  if (!user) {
    return <Navigate to={paths.auth.login.getPath(`${pathname}${search}`)} />;
  }

  if (!user.isEmailVerified) {
    return <Navigate to={paths.auth.verify.path} />;
  }

  return (
    <AuthShell>
      <AuthBrand
        subtitle="Sign in to DSTK from your terminal"
        title="Connect a device"
      />
      <AuthCard>
        {userCode
          ? (
              <DeviceRequest
                key={userCode}
                onReset={() => setSearchParams({})}
                userCode={userCode}
              />
            )
          : (
              <DeviceCodeForm
                onSubmit={code => setSearchParams({ [USER_CODE_PARAM]: code })}
              />
            )}
      </AuthCard>
    </AuthShell>
  );
}
