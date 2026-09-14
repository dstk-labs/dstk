import type { GetProjectQueryVariables } from "@/graphql/types";
import { gql } from "@/graphql";
import { preloadQuery } from "@/lib/apollo";

export const GET_PROJECT = gql(`
  query GetProject($projectId: String!) {
    getProject(projectId: $projectId) {
      dateCreated
      dateModified
      description
      isArchived
      name
      projectId
      createdBy {
        realName
      }
      modifiedBy {
        realName
      }
    }
  }
`);

export async function projectLoader({ projectId }: GetProjectQueryVariables) {
  return preloadQuery(GET_PROJECT, {
    variables: { projectId },
  }).toPromise();
}

export type ProjectLoader = Awaited<ReturnType<typeof projectLoader>>;
