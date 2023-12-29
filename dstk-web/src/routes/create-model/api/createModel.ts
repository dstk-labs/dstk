import { useMutation, type TypedDocumentNode, gql } from '@apollo/client';

import type { CreateMLModel } from '@/types/MLModel';

const CREATE_MODEL: TypedDocumentNode<CreateMLModel> = gql`
    mutation CreateModel($data: ModelInput!) {
        createModel(data: $data) {
            modelId
        }
    }
`;

export const useCreateModel = () => useMutation(CREATE_MODEL);
