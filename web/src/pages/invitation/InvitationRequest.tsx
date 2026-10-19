import { useMutation, useQuery } from "@apollo/client";
import { Button, Stack, Text } from "@mantine/core";
import { Link } from "react-router";

import { paths } from "@/config/paths";
import { LOGOUT } from "@/features/auth/api/logout";
import { AuthStatus } from "@/features/auth/components/AuthStatus";
import { GET_USER } from "@/features/auth/loaders/authLoader";
import { ACCEPT_INVITATION, REJECT_INVITATION } from "@/features/teams/api/respondToInvitation";
import { gql } from "@/graphql";

const GET_INVITATION = gql(`
  query GetInvitation($invitationId: String!) {
    invitation {
      get(invitationId: $invitationId) {
        id
        status
        role
        expiresAt
        inviter {
          realName
        }
        teamId {
          name
        }
      }
    }
  }
`);

const REFETCH_QUERIES = ["GetInvitation", "Settings", "ListTeamsForDropdown", "ListTeamsForTable"];

type InvitationRequestProps = {
  invitationId: string;
  userEmail?: string | null;
};

function DashboardButton({ variant }: { variant?: "subtle" }) {
  return (
    <Button component={Link} fullWidth to={paths.dashboard.overview.getPath()} variant={variant}>
      Go to dashboard
    </Button>
  );
}

function SwitchAccountActions() {
  const [logout, { loading }] = useMutation(LOGOUT, {
    refetchQueries: [{ query: GET_USER }],
  });

  return (
    <Stack gap="xs" w="100%">
      <Button fullWidth loading={loading} onClick={() => logout()}>
        Sign in with a different account
      </Button>
      <DashboardButton variant="subtle" />
    </Stack>
  );
}

export function InvitationRequest({ invitationId, userEmail }: InvitationRequestProps) {
  const { data, error, loading } = useQuery(GET_INVITATION, {
    fetchPolicy: "network-only",
    variables: { invitationId },
  });
  const [acceptInvitation, { error: acceptError, loading: accepting }] = useMutation(
    ACCEPT_INVITATION,
    { refetchQueries: REFETCH_QUERIES, variables: { invitationId } },
  );
  const [rejectInvitation, { error: rejectError, loading: rejecting }] = useMutation(
    REJECT_INVITATION,
    { refetchQueries: REFETCH_QUERIES, variables: { invitationId } },
  );

  if (loading) {
    return <AuthStatus subtitle="One moment." title="Checking your invitation" />;
  }

  const requestError = error ?? acceptError ?? rejectError;
  const invitation = data?.invitation.get;

  if (requestError || !invitation) {
    return (
      <AuthStatus
        actions={<SwitchAccountActions />}
        subtitle={(
          <>
            {requestError?.message ?? "We could not find that invitation."}
            {userEmail && (
              <>
                <br />
                {`You're signed in as ${userEmail}.`}
              </>
            )}
          </>
        )}
        title="This invitation did not work"
        tone="error"
      />
    );
  }

  const teamName = invitation.teamId?.name ?? "this team";
  const inviterName = invitation.inviter?.realName ?? "A teammate";

  if (invitation.status === "accepted") {
    return (
      <AuthStatus
        actions={<DashboardButton />}
        subtitle={`You are now a member of ${teamName}.`}
        title="Invitation accepted"
        tone="success"
      />
    );
  }

  if (invitation.status === "rejected") {
    return (
      <AuthStatus
        actions={<DashboardButton />}
        subtitle={`You declined the invitation to ${teamName}.`}
        title="Invitation declined"
        tone="info"
      />
    );
  }

  if (invitation.status === "canceled") {
    return (
      <AuthStatus
        actions={<DashboardButton />}
        subtitle={`${inviterName} canceled this invitation.`}
        title="Invitation canceled"
        tone="error"
      />
    );
  }

  if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
    return (
      <AuthStatus
        actions={<DashboardButton />}
        subtitle={`Ask ${inviterName} to send you a new one.`}
        title="This invitation expired"
        tone="error"
      />
    );
  }

  return (
    <Stack gap="lg">
      <Text c="var(--color-text-secondary)" fw={300} size="sm">
        {inviterName}
        {" invited you to join "}
        <Text c="var(--color-text-primary)" component="span" fw={400} inherit>
          {teamName}
        </Text>
        {` as a ${invitation.role}.`}
      </Text>
      <Stack gap="xs">
        <Button disabled={rejecting} fullWidth loading={accepting} onClick={() => acceptInvitation()}>
          Accept
        </Button>
        <Button
          disabled={accepting}
          fullWidth
          loading={rejecting}
          onClick={() => rejectInvitation()}
          variant="subtle"
        >
          Decline
        </Button>
      </Stack>
    </Stack>
  );
}
