import { gql, useQuery, type TypedDocumentNode } from '@apollo/client';

import { useNotificationStore } from '@/stores';
import type { GetMLModelVersion } from '@/types/MLModelVersion';

const GET_MODEL_VERSION: TypedDocumentNode<GetMLModelVersion> = gql`
    query GetMLModelVersion($modelVersionId: String!) {
        getMLModelVersion(modelVersionId: $modelVersionId) {
            modelId {
                dateModified
                modelName
            }
            description
            modelVersionId
            numericVersion
            createdBy {
                userName
            }
            dateCreated
        }
    }
`;

export const useGetMLModelVersion = (modelVersionId: string) => {
    const { addNotification } = useNotificationStore();

    return useQuery(GET_MODEL_VERSION, {
        variables: {
            modelVersionId: modelVersionId,
        },
        onError: (error) =>
            addNotification({
                type: 'error',
                title: 'Error',
                children: error.message,
            }),
    });
};
