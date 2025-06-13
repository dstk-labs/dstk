import { gql } from '@/graphql';
import { preloadQuery } from '@/lib/apollo';

const LIST_TEAMS = gql(`
    query ListTeams {
        listTeams {
            name
        }
    }`);

export const teamsLoader = async () => preloadQuery(LIST_TEAMS).toPromise();
