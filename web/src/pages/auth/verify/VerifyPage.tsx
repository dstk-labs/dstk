import { useMutation } from "@apollo/client";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Navigate } from "react-router";

import { paths } from "@/config/paths";
import { AuthStatus } from "@/features/auth/components/AuthStatus";
import { useUser } from "@/features/auth/hooks/authHooks";
import { gql } from "@/graphql";

const SEND_VERIFICATION_EMAIL = gql(`
  mutation SendVerificationEmail {
    sendVerificationEmail
  }
`);

export function VerifyPage() {
  const { user } = useUser();
  const [sendVerificationEmail, { loading }] = useMutation(SEND_VERIFICATION_EMAIL);

  if (!user) {
    return <Navigate to={paths.auth.login.path} />;
  }

  if (user.isEmailVerified) {
    return <Navigate to={paths.dashboard.overview.path} />;
  }

  const handleResend = () => {
    sendVerificationEmail({
      onCompleted: (data) => {
        if (data.sendVerificationEmail) {
          notifications.show({
            color: "green",
            message: "Verification email has been sent.",
            title: "Email sent",
          });
        }
        else {
          notifications.show({
            color: "red",
            message: "We could not send the verification email. Please try again.",
            title: "Something went wrong",
          });
        }
      },
    });
  };

  return (
    <AuthStatus
      actions={(
        <>
          <Button fullWidth loading={loading} onClick={handleResend}>
            Resend verification email
          </Button>
          <Button
            component="a"
            href={`mailto:${user.email}`}
            size="sm"
            style={{ color: "var(--color-text-muted)" }}
            variant="subtle"
          >
            Open your inbox
          </Button>
        </>
      )}
      subtitle={(
        <>
          We sent a verification link to
          {" "}
          <strong style={{ color: "var(--color-text-secondary)", fontWeight: 400 }}>
            {user.email}
          </strong>
          . Follow the link inside to continue.
        </>
      )}
      title="Verify your email"
      tone="info"
    />
  );
}
