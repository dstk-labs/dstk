import { gql, useMutation, type TypedDocumentNode } from '@apollo/client';

import { useNotificationStore } from '@/stores';
import type { AddToTeam } from '@/types/Team';

const ADD_TO_TEAM: TypedDocumentNode<AddToTeam> = gql`
    mutation AddToTeam($data: AddTeamMemberInput!) {
        addToTeam(data: $data)
    }
`;

export const useAddTeamMember = () => {
    const { addNotification } = useNotificationStore();

    return useMutation(ADD_TO_TEAM, {
        refetchQueries: ['ListTeamMembers'],
        onError: (error) =>
            addNotification({
                type: 'error',
                title: 'Error',
                children: error.message,
            }),
    });
};
