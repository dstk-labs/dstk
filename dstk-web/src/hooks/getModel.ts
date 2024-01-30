import { gql, useQuery, type TypedDocumentNode } from '@apollo/client';

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
    return useQuery(GET_MODEL, {
        variables: {
            modelId: modelId,
        },
    });
};
