import { gql, useMutation, type TypedDocumentNode } from '@apollo/client';

import { MLModelVersion } from '@/types/MLModelVersion';

const CREATE_MODEL_VERSION: TypedDocumentNode<MLModelVersion> = gql`
    mutation CreateModelVersion($data: ModelVersionInput) {
        createModelVersion(data: $data) {
            numericVersion
        }
    }
`;

export const useCreateModelVersion = () => useMutation(CREATE_MODEL_VERSION);
