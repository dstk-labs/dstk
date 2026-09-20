import { useMutation } from "@apollo/client";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";

import { gql } from "@/graphql";

const ACCEPT_INVITATION = gql(`
  mutation AcceptInvitation($invitationId: String!) {
    acceptInvitation(invitationId: $invitationId) {
      id
    }
  }
`);

const REJECT_INVITATION = gql(`
  mutation RejectInvitation($invitationId: String!) {
    rejectInvitation(invitationId: $invitationId) {
      id
    }
  }
`);

const REFETCH_QUERIES = ["Settings", "ListTeamsForDropdown", "ListTeamsForTable"];

type RespondToInvitationProps = {
  invitationId: string;
  teamName: string;
};

export function RespondToInvitation({ invitationId, teamName }: RespondToInvitationProps) {
  const [acceptInvitation, { loading: accepting }] = useMutation(ACCEPT_INVITATION);
  const [rejectInvitation, { loading: rejecting }] = useMutation(REJECT_INVITATION);

  const loading = accepting || rejecting;

  const onAccept = () =>
    acceptInvitation({
      onCompleted: () => {
        notifications.show({
          color: "green",
          message: `You joined ${teamName}`,
          title: "Invitation accepted",
        });
      },
      refetchQueries: REFETCH_QUERIES,
      variables: { invitationId },
    });

  const onReject = () =>
    rejectInvitation({
      onCompleted: () => {
        notifications.show({
          color: "gray",
          message: `Declined invitation to ${teamName}`,
          title: "Invitation declined",
        });
      },
      refetchQueries: REFETCH_QUERIES,
      variables: { invitationId },
    });

  return (
    <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
      <Button disabled={loading} loading={rejecting} onClick={onReject} size="compact" variant="default">
        Decline
      </Button>
      <Button disabled={loading} loading={accepting} onClick={onAccept} size="compact">
        Accept
      </Button>
    </div>
  );
}
