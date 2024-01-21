import { gql, useQuery, type TypedDocumentNode } from '@apollo/client';
import { useAtom } from 'jotai';

import { useNotificationStore } from '@/stores';
import type { MLModelVersionList } from '@/types/MLModelVersion';

import { modelVersionPaginationAtom } from '../atoms';

const LIST_MODEL_VERSIONS: TypedDocumentNode<MLModelVersionList> = gql`
    query ListMLModelVersions($modelId: String!, $after: String, $first: Limit!) {
        listMLModelVersions(modelId: $modelId, after: $after, first: $first) {
            edges {
                cursor
                node {
                    createdBy {
                        userName
                    }
                    dateCreated
                    modelVersionId
                    numericVersion
                    modelId {
                        modelId
                    }
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

export const useListModelVersions = (modelId: string) => {
    const [inputs, setInputs] = useAtom(modelVersionPaginationAtom);
    const { addNotification } = useNotificationStore();

    return useQuery(LIST_MODEL_VERSIONS, {
        variables: {
            after: inputs.continuationTokens.at(-1),
            first: inputs.first,
            modelId: modelId,
        },
        onCompleted: (data) => {
            setInputs((values) => ({
                ...values,
                hasPreviousPage: data.listMLModelVersions.pageInfo.hasPreviousPage,
                hasNextPage: data.listMLModelVersions.pageInfo.hasNextPage,
            }));
        },
        onError: (error) =>
            addNotification({
                type: 'error',
                title: 'Error',
                children: error.message,
            }),
    });
};
