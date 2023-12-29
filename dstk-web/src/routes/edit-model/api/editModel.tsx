import { gql, useMutation, type TypedDocumentNode } from '@apollo/client';

import type { EditMLModel } from '@/types/MLModel';

const EDIT_MODEL: TypedDocumentNode<EditMLModel> = gql`
    mutation EditModel($data: ModelInput!, $modelId: String!) {
        editModel(data: $data, modelId: $modelId) {
            modelId
        }
    }
`;

export const useEditModel = () => useMutation(EDIT_MODEL);
