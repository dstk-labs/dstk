import type { LoaderFunctionArgs } from "react-router";
import { z } from "zod/v4";

import { gql } from "@/graphql";
import { preloadQuery } from "@/lib/apollo";
import { ensureDefaultQueryParams } from "@/lib/ensureDefaultQueryParams";
import { parseQueryParams } from "@/lib/parseQueryParams";
import { useTeamStore } from "@/stores/teamStore";

export const LIST_PROJECTS_FOR_TABLE = gql(`
    query ListProjectsForTable(
      $teamId: String!,
      $includeArchived: Boolean!,
      $projectName: String
    ) {
      listProjects(
        teamId: $teamId,
        includeArchived: $includeArchived,
        projectName: $projectName
      ) {
        name
        projectId
        isArchived
        description
        dateModified
      }
    }
`);

const projectsLoaderSchema = z.object({
  includeArchived: z.string().transform(val => val === "true"),
  projectName: z.string().optional(),
});

export async function projectsLoader({ request }: LoaderFunctionArgs) {
  const { selectedTeam } = useTeamStore.getState();

  ensureDefaultQueryParams(request, {
    includeArchived: "false",
  });

  const { ...params } = parseQueryParams(request, projectsLoaderSchema);

  return preloadQuery(LIST_PROJECTS_FOR_TABLE, {
    variables: { teamId: selectedTeam!, ...params },
  }).toPromise();
}

export type ProjectsLoader = Awaited<ReturnType<typeof projectsLoader>>;
