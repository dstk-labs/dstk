import {
    gql,
    useLazyQuery,
    type LazyQueryHookOptions,
    type TypedDocumentNode,
} from '@apollo/client';
import type { Project } from '@/types/api';

type ListProjectsPick = Pick<Project, 'name' | 'projectId'>;

type ListProjects = {
    listProjects: ListProjectsPick[];
};

type ListProjectsVariables = {
    teamId: string;
};

export const LIST_PROJECTS: TypedDocumentNode<ListProjects, ListProjectsVariables> = gql`
    query ListProjects($teamId: String!) {
        listProjects(teamId: $teamId) {
            name
            projectId
        }
    }
`;

export const useListProjects = (
    options?: LazyQueryHookOptions<ListProjects, ListProjectsVariables>,
) => useLazyQuery(LIST_PROJECTS, options);
