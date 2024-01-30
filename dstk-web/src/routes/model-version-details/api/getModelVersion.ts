import { gql, useQuery, type TypedDocumentNode } from '@apollo/client';

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
    return useQuery(GET_MODEL_VERSION, {
        variables: {
            modelVersionId: modelVersionId,
        },
    });
};
