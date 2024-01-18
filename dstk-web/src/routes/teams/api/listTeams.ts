import { gql, useQuery, type TypedDocumentNode } from '@apollo/client';

import { useNotificationStore } from '@/stores';
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

export const useListTeams = () => {
    const { addNotification } = useNotificationStore();

    return useQuery(LIST_TEAMS, {
        onError: (error) =>
            addNotification({
                type: 'error',
                title: 'Error',
                children: error.message,
            }),
    });
};
