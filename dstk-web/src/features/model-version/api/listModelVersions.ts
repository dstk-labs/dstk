import {
    gql,
    useSuspenseQuery,
    type SuspenseQueryHookOptions,
    type TypedDocumentNode,
} from '@apollo/client';
import type { Edge, MLModelVersion } from '@/types/api';
import type { Limit } from '@/types/filters';

type ListMLModelVersionsPick = Pick<
    MLModelVersion,
    'dateCreated' | 'isArchived' | 'modelVersionId' | 'numericVersion'
> & {
    createdBy: {
        userName: MLModelVersion['createdBy']['userName'];
    };
};

type ListMLModelVersions = {
    listMLModelVersions: Edge<ListMLModelVersionsPick>;
};

type ListMLModelVersionsVariables = {
    after?: string;
    first: Limit;
    modelId: string;
};

export const LIST_MODEL_VERSIONS: TypedDocumentNode<
    ListMLModelVersions,
    ListMLModelVersionsVariables
> = gql`
    query ListMLModelVersions($modelId: String!, $after: String, $first: Limit!) {
        listMLModelVersions(modelId: $modelId, after: $after, first: $first) {
            edges {
                cursor
                node {
                    createdBy {
                        userName
                    }
                    dateCreated
                    isArchived
                    modelVersionId
                    numericVersion
                }
            }
            pageInfo {
                continuationToken
                hasNextPage
                hasPreviousPage
            }
        }
    }
`;

export const useListModelVersions = (
    options: SuspenseQueryHookOptions<ListMLModelVersions, ListMLModelVersionsVariables>,
) => useSuspenseQuery(LIST_MODEL_VERSIONS, options);
