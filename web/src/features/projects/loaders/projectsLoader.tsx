import type { LoaderFunctionArgs } from "react-router";
import { z } from "zod/v4";

import { ensureSelectedTeam } from "@/features/teams/lib/ensureSelectedTeam";
import { gql } from "@/graphql";
import { preloadQuery } from "@/lib/apollo";
import { ensureDefaultQueryParams } from "@/lib/ensureDefaultQueryParams";
import { parseQueryParams } from "@/lib/parseQueryParams";
import { limitSchema, useLimitStore } from "@/stores/limitStore";

export const LIST_PROJECTS_FOR_TABLE = gql(`
  query ListProjectsForTable(
    $after: String
    $first: Limit!
    $includeArchived: Boolean!
    $projectName: String
    $teamId: String!
  ) {
    listProjects(
      after: $after
      first: $first
      includeArchived: $includeArchived
      projectName: $projectName
      teamId: $teamId
    ) {
      pageInfo {
        continuationToken
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          dateModified
          description
          isArchived
          name
          projectId
          createdBy {
            realName
          }
        }
      }
    }
  }
`);

const projectsLoaderSchema = z.object({
  after: z.string().optional(),
  first: limitSchema,
  includeArchived: z.string().transform(val => val === "true"),
  projectName: z.string().optional(),
});

export async function projectsLoader({ request }: LoaderFunctionArgs) {
  const { limit } = useLimitStore.getState();

  ensureDefaultQueryParams(request, {
    first: limit.toString(),
    includeArchived: "false",
  });

  const params = parseQueryParams(request, projectsLoaderSchema);

  const teamId = (await ensureSelectedTeam()) ?? "";

  return preloadQuery(LIST_PROJECTS_FOR_TABLE, {
    fetchPolicy: "cache-and-network",
    variables: { teamId, ...params },
  }).toPromise();
}

export type ProjectsLoader = Awaited<ReturnType<typeof projectsLoader>>;
