import { ShieldIcon } from "lucide-react";

import { EmptyState } from "@/components/emptyState/EmptyState";
import { Panel } from "@/components/panel/Panel";
import { StatusBadge } from "@/components/statusBadge/StatusBadge";
import { useUser } from "@/features/auth/hooks/authHooks";

import { DisableTwoFactor } from "./DisableTwoFactor";
import { EnableTwoFactor } from "./EnableTwoFactor";
import { RegenerateBackupCodes } from "./RegenerateBackupCodes";

export function TwoFactorPanel() {
  const { user } = useUser();

  const enabled = Boolean(user?.isTwoFactorEnabled);
  const hasPassword = Boolean(user?.hasPassword);

  return (
    <Panel>
      <Panel.Header
        actions={
          hasPassword
            ? (
                <>
                  {enabled && <StatusBadge tone="success">Enabled</StatusBadge>}
                  {enabled && <RegenerateBackupCodes />}
                  {enabled ? <DisableTwoFactor /> : <EnableTwoFactor />}
                </>
              )
            : undefined
        }
        title="Two-Factor Authentication"
      />
      {!enabled && (
        <Panel.Body flush>
          <EmptyState
            description="Enable to use an authenticator app for sign-ins"
            icon={<ShieldIcon size={24} />}
            title="No second factor"
          />
        </Panel.Body>
      )}
    </Panel>
  );
}
