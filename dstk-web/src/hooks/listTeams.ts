import { gql, useQuery, type TypedDocumentNode } from '@apollo/client';

import type { TeamList } from '@/types/Team';

const LIST_TEAMS: TypedDocumentNode<TeamList> = gql`
    query ListTeams($teamId: String) {
        listTeams(teamId: $teamId) {
            description
            name
            teamId
            dateModified
            dateCreated
        }
    }
`;

export const useListTeams = (teamId?: string) => {
    return useQuery(LIST_TEAMS, {
        variables: {
            teamId: teamId,
        },
    });
};
