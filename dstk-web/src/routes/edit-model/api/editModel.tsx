import { gql, useMutation, type TypedDocumentNode } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import type { EditMLModel } from '@/types/MLModel';

const EDIT_MODEL: TypedDocumentNode<EditMLModel> = gql`
    mutation EditModel($data: ModelInput!, $modelId: String!) {
        editModel(data: $data, modelId: $modelId) {
            modelId
        }
    }
`;

export const useEditModel = () => {
    const navigate = useNavigate();

    return useMutation(EDIT_MODEL, {
        onCompleted: () => navigate('/dashboard/models'),
        refetchQueries: ['ListMLModels', 'GetMLModel'],
    });
};
