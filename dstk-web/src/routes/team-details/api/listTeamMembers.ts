import { gql, useQuery, type TypedDocumentNode } from '@apollo/client';

import { useNotificationStore } from '@/stores';
import type { ListTeamMembers } from '@/types/User';

const LIST_TEAM_MEMBERS: TypedDocumentNode<ListTeamMembers> = gql`
    query ListTeamMembers($teamId: String!) {
        listTeamMembers(teamId: $teamId) {
            isAdmin
            primaryEmail
            userName
            userId
        }
    }
`;

export const useListTeamMembers = (teamId: string) => {
    const { addNotification } = useNotificationStore();

    return useQuery(LIST_TEAM_MEMBERS, {
        variables: {
            teamId: teamId,
        },
        onError: (error) =>
            addNotification({
                type: 'error',
                title: 'Error',
                children: error.message,
            }),
    });
};
