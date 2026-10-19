import { gql } from "@/graphql";

export const ACCEPT_INVITATION = gql(`
  mutation AcceptInvitation($invitationId: String!) {
    invitation {
      accept(invitationId: $invitationId) {
        id
        status
      }
    }
  }
`);

export const REJECT_INVITATION = gql(`
  mutation RejectInvitation($invitationId: String!) {
    invitation {
      reject(invitationId: $invitationId) {
        id
        status
      }
    }
  }
`);
