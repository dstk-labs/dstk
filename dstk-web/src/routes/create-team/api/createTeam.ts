import { gql, useMutation, type TypedDocumentNode } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
    const navigate = useNavigate();

    return useMutation(CREATE_TEAM, {
        refetchQueries: ['ListTeams'],
        onCompleted: (data) => {
            navigate('/teams');
            toast.success(`Successfully created team ${data.createTeam.name}`);
        },
    });
};
