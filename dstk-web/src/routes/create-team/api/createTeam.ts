import { gql, useMutation, type TypedDocumentNode } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { useNotificationStore } from '@/stores';
import type { CreateTeam } from '@/types/Team';

const CREATE_TEAM: TypedDocumentNode<CreateTeam> = gql`
    mutation CreateTeam($data: TeamInput!) {
        createTeam(data: $data) {
            name
            teamId
        }
    }
`;

export const useCreateTeam = () => {
    const { addNotification } = useNotificationStore();
    const navigate = useNavigate();

    return useMutation(CREATE_TEAM, {
        refetchQueries: ['ListTeams'],
        onCompleted: (data) => {
            navigate('/teams');
            addNotification({
                type: 'success',
                title: `Successfully created team ${data.createTeam.name}`,
            });
        },
        onError: (error) =>
            addNotification({
                type: 'error',
                title: 'Error',
                children: error.message,
            }),
    });
};
