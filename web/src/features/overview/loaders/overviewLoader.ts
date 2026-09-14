import { ensureSelectedTeam } from "@/features/teams/lib/ensureSelectedTeam";
import { gql } from "@/graphql";
import { preloadQuery } from "@/lib/apollo";

export const OVERVIEW_QUERY = gql(`
  query Overview($teamId: String!) {
    listMLModels(teamId: $teamId, first: 10, includeArchived: false) {
      edges {
        node {
          modelId
          modelName
          description
          dateModified
          isArchived
          currentModelVersion {
            numericVersion
            isFinalized
            isArchived
          }
          project {
            name
          }
          storageProvider {
            bucket
          }
          modifiedBy {
            realName
          }
        }
      }
    }
    listProjects(teamId: $teamId, first: 50, includeArchived: false) {
      edges {
        node {
          projectId
          name
          dateModified
        }
      }
    }
    listStorageProviders(teamId: $teamId, first: 50, includeArchived: false) {
      edges {
        node {
          providerId
        }
      }
    }
  }
`);

export async function overviewLoader() {
  const teamId = (await ensureSelectedTeam()) ?? "";

  return preloadQuery(OVERVIEW_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: { teamId },
  }).toPromise();
}

export type OverviewLoader = Awaited<ReturnType<typeof overviewLoader>>;
