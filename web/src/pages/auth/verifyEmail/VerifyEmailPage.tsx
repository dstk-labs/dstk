import { useMutation } from "@apollo/client";
import { Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { paths } from "@/config/paths";
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
  const [verifyEmail, { loading }] = useMutation(VERIFY_EMAIL);

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
          message: "🎉 Email successfully verified",
        });
        navigate(paths.dashboard.overview.path);
      },
    });
  }, [searchParams, verifyEmail, navigate]);

  if (loading) {
    return (
      <Stack>
        <Title order={1} size="h2">
          Verifying your email...
        </Title>
        <Text size="sm" c="dimmed" mt="xs">
          Please wait while we verify your email address.
        </Text>
      </Stack>
    );
  }
}
