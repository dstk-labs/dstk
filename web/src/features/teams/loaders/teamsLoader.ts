import type { LoaderFunctionArgs } from "react-router";

import { z } from "zod/v4";

import { gql } from "@/graphql";
import { preloadQuery } from "@/lib/apollo";
import { ensureDefaultQueryParams } from "@/lib/ensureDefaultQueryParams";
import { parseQueryParams } from "@/lib/parseQueryParams";
import { limitSchema, useLimitStore } from "@/stores/limitStore";

export const LIST_TEAMS_FOR_DROPDOWN = gql(`
  query ListTeamsForDropdown {
    listTeams(first: 50) {
      edges {
        node {
          name
          teamId
        }
      }
    }
  }
`);

export async function teamsDropdownLoader() {
  return preloadQuery(LIST_TEAMS_FOR_DROPDOWN).toPromise();
}

export type TeamsDropdownLoader = Awaited<
  ReturnType<typeof teamsDropdownLoader>
>;

export const LIST_TEAMS_FOR_TABLE = gql(`
  query ListTeamsForTable(
    $after: String
    $first: Limit!
    $includeArchived: Boolean!
    $teamName: String
  ) {
    listTeams(
      after: $after
      first: $first
      includeArchived: $includeArchived
      teamName: $teamName
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
          teamId
        }
      }
    }
  }
`);

const teamsTableSchema = z.object({
  after: z.string().optional(),
  first: limitSchema,
  includeArchived: z.string().transform(val => val === "true"),
  teamName: z.string().optional(),
});

export async function teamsTableLoader({ request }: LoaderFunctionArgs) {
  const { limit } = useLimitStore.getState();

  ensureDefaultQueryParams(request, {
    first: limit.toString(),
    includeArchived: "false",
  });

  const params = parseQueryParams(request, teamsTableSchema);

  return preloadQuery(LIST_TEAMS_FOR_TABLE, {
    fetchPolicy: "cache-and-network",
    variables: { ...params },
  }).toPromise();
}

export type TeamsTableLoader = Awaited<ReturnType<typeof teamsTableLoader>>;
