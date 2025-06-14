import { gql } from '@/graphql';
import { preloadQuery } from '@/lib/apollo';

export const LIST_TEAMS = gql(`
    query ListTeams {
        listTeams {
            name
            teamId
        }
    }`);

export const teamsLoader = async () => preloadQuery(LIST_TEAMS).toPromise();
