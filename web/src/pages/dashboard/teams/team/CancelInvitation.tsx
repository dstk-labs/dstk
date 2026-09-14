import { useMutation } from "@apollo/client";
import { notifications } from "@mantine/notifications";
import { XIcon } from "lucide-react";

import { RowAction } from "@/components/rowActions/RowActions";
import { gql } from "@/graphql";

const CANCEL_INVITATION = gql(`
  mutation CancelInvitation($invitationId: String!, $teamId: String!) {
    cancelInvitation(invitationId: $invitationId, teamId: $teamId) {
      id
    }
  }
`);

type CancelInvitationProps = {
  email: string;
  invitationId: string;
  teamId: string;
};

export function CancelInvitation({ email, invitationId, teamId }: CancelInvitationProps) {
  const [cancelInvitation, { loading }] = useMutation(CANCEL_INVITATION);

  const onClick = () =>
    cancelInvitation({
      onCompleted: () => {
        notifications.show({
          color: "gray",
          message: `Cancelled invitation for ${email}`,
          title: "Invitation cancelled",
        });
      },
      refetchQueries: ["GetTeam"],
      variables: { invitationId, teamId },
    });

  return (
    <RowAction
      danger
      disabled={loading}
      icon={<XIcon size={14} />}
      label="Cancel Invitation"
      onClick={onClick}
    />
  );
}
