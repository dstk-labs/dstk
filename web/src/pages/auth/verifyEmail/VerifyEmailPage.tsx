import { useMutation } from "@apollo/client";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { AnimatedDots } from "@/components/spinnerRing/SpinnerRing";
import { paths } from "@/config/paths";
import { AuthStatus } from "@/features/auth/components/AuthStatus";
import { GET_USER } from "@/features/auth/loaders/authLoader";
import { LIST_TEAMS_FOR_DROPDOWN } from "@/features/teams/loaders/teamsLoader";
import { gql } from "@/graphql";

const VERIFY_EMAIL = gql(`
    mutation VerifyEmail($data: VerifyEmailInput!) {
      verifyEmail(data: $data)
    }
`);

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifyEmail] = useMutation(VERIFY_EMAIL);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate(paths.auth.login.path);
      return;
    }

    verifyEmail({
      variables: {
        data: {
          token,
        },
      },
      refetchQueries: [{ query: GET_USER }, { query: LIST_TEAMS_FOR_DROPDOWN }],
      onCompleted: () => {
        notifications.show({
          color: "green",
          message: "Your email address has been verified.",
          title: "Email verified",
        });
        navigate(paths.dashboard.overview.path);
      },
      onError: error => setErrorMessage(error.message),
    });
  }, [searchParams, verifyEmail, navigate]);

  if (errorMessage) {
    return (
      <AuthStatus
        actions={(
          <Button fullWidth onClick={() => navigate(paths.auth.login.path)}>
            Back to sign in
          </Button>
        )}
        subtitle={errorMessage}
        title="Verification failed"
        tone="error"
      />
    );
  }

  return (
    <AuthStatus
      subtitle="Please wait while we confirm your email address."
      title={(
        <>
          Verifying your email
          <AnimatedDots />
        </>
      )}
    />
  );
}
