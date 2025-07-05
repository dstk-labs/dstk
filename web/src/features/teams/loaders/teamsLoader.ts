import type { LoaderFunctionArgs } from 'react-router';

import { z } from 'zod/v4';

import { gql } from '@/graphql';
import { preloadQuery } from '@/lib/apollo';
import { ensureDefaultQueryParams } from '@/lib/ensureDefaultQueryParams';
import { parseQueryParams } from '@/lib/parseQueryParams';

export const LIST_TEAMS_FOR_DROPDOWN = gql(`
  query ListTeamsForDropdown {
    listTeams {
      name
      teamId
    }
  }
`);

export const teamsDropdownLoader = async () =>
  preloadQuery(LIST_TEAMS_FOR_DROPDOWN).toPromise();

export type TeamsDropdownLoader = Awaited<
  ReturnType<typeof teamsDropdownLoader>
>;

export const LIST_TEAMS_FOR_TABLE = gql(`
  query ListTeamsForTable($includeArchived: Boolean!, $teamName: String) {
    listTeams(includeArchived: $includeArchived, teamName: $teamName) {
      dateModified
      description
      isArchived
      name
      teamId
    }
  }
`);

const teamsTableSchema = z.object({
  includeArchived: z.string().transform((val) => val === 'true'),
  teamName: z.string().optional(),
});

export const teamsTableLoader = async ({ request }: LoaderFunctionArgs) => {
  ensureDefaultQueryParams(request, {
    includeArchived: 'false',
  });

  const { ...params } = parseQueryParams(request, teamsTableSchema);

  return preloadQuery(LIST_TEAMS_FOR_TABLE, {
    variables: { ...params },
  }).toPromise();
};

export type TeamsTableLoader = Awaited<ReturnType<typeof teamsTableLoader>>;
