import { gql, useMutation, type TypedDocumentNode } from '@apollo/client';

import { CreateMLModelVersion } from '@/types/MLModelVersion';

const CREATE_MODEL_VERSION: TypedDocumentNode<CreateMLModelVersion> = gql`
    mutation CreateModelVersion($data: ModelVersionInputType!) {
        createModelVersion(data: $data) {
            modelVersionId
            numericVersion
            modelId {
                modelId
            }
        }
    }
`;

export const useCreateModelVersion = () => useMutation(CREATE_MODEL_VERSION);
