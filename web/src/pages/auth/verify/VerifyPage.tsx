import { useMutation } from "@apollo/client";
import { Button, Flex, Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { ChevronRight } from "lucide-react";
import { Navigate } from "react-router";
import { paths } from "@/config/paths";
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

  if (user?.isEmailVerified) {
    return <Navigate to={paths.dashboard.overview.path} />;
  }

  const handleClick = () => {
    sendVerificationEmail({
      onCompleted: (data) => {
        if (data.sendVerificationEmail) {
          notifications.show({
            message: "Verification email has been sent!",
            title: "Success",
          });
        }
        else {
          notifications.show({
            message: "There was a problem sending the verification email. Please try again.",
            title: "Error",
            variant: "error",
          });
        }
      },
    });
  };

  return (
    <Stack>
      <div>
        <Title order={1} size="h2">
          Verify your email
        </Title>
        <Text size="sm" c="dimmed" mt="xs">
          We've sent a link to your email address:
          {" "}
          <Text span fw={600}>
            {user?.email}
          </Text>
        </Text>
        <Text size="sm" c="dimmed">
          Please follow the link inside to continue.
        </Text>
      </div>

      <Flex align="center" direction="row" mt="md">
        <Text size="sm" c="dimmed">
          Didn't receive an email?
        </Text>
        <Button ml={-12} loading={loading} size="sm" fw={500} onClick={handleClick} variant="transparent">
          Resend
          <ChevronRight size={16} />
        </Button>
      </Flex>
    </Stack>
  );
}
