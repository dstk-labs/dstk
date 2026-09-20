import { gql } from "@/graphql";
import { preloadQuery } from "@/lib/apollo";

export const SETTINGS_QUERY = gql(`
  query Settings {
    listApiKeys {
      apiKeyId
      apiKey
      dateCreated
    }
    listInvitations(status: "pending", first: 50) {
      edges {
        node {
          id
          role
          expiresAt
          dateCreated
          teamId {
            name
            teamId
          }
          inviter {
            realName
          }
        }
      }
    }
  }
`);

export async function settingsLoader() {
  return preloadQuery(SETTINGS_QUERY, {
    fetchPolicy: "cache-and-network",
  }).toPromise();
}

export type SettingsLoader = Awaited<ReturnType<typeof settingsLoader>>;
