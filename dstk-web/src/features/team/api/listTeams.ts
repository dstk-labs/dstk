import { gql, type TypedDocumentNode } from '@apollo/client';
import type { Team } from '@/types/api';

type ListTeamsPick = Pick<Team, 'name' | 'teamId'>;

type ListTeams = {
    listTeams: ListTeamsPick[];
};

export const LIST_TEAMS: TypedDocumentNode<ListTeams> = gql`
    query ListProjects {
        listTeams {
            name
            teamId
        }
    }
`;
