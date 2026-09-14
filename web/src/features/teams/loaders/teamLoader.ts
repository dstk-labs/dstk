import type { GetTeamQueryVariables } from "@/graphql/types";
import { gql } from "@/graphql";
import { preloadQuery } from "@/lib/apollo";

export const GET_TEAM = gql(`
  query GetTeam($teamId: String!) {
    listTeams(teamId: $teamId, first: 10, includeArchived: true) {
      edges {
        node {
          dateCreated
          description
          isArchived
          name
          teamId
        }
      }
    }
    listTeamMembers(teamId: $teamId) {
      dateCreated
      memberId
      role
      user {
        email
        realName
        userName
      }
    }
    listInvitations(teamId: $teamId, status: "pending", first: 50) {
      edges {
        node {
          dateCreated
          email
          expiresAt
          id
          role
          inviter {
            realName
          }
        }
      }
    }
  }
`);

export async function teamLoader({ teamId }: GetTeamQueryVariables) {
  return preloadQuery(GET_TEAM, {
    fetchPolicy: "cache-and-network",
    variables: { teamId },
  }).toPromise();
}

export type TeamLoader = Awaited<ReturnType<typeof teamLoader>>;
