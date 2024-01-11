import { gql, useQuery, type TypedDocumentNode } from '@apollo/client';

import { useNotificationStore } from '@/stores';
import type { GetMLModel } from '@/types/MLModel';

const GET_MODEL: TypedDocumentNode<GetMLModel> = gql`
    query GetMLModel($modelId: String!) {
        getMLModel(modelId: $modelId) {
            description
            modelId
            modelName
            storageProvider {
                providerId
            }
        }
    }
`;

export const useGetModel = (modelId: string) => {
    const { addNotification } = useNotificationStore();

    return useQuery(GET_MODEL, {
        variables: {
            modelId: modelId,
        },
        onError: (error) =>
            addNotification({
                type: 'error',
                title: 'Error',
                children: error.message,
            }),
    });
};
