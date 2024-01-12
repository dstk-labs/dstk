import { useMutation, type TypedDocumentNode, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { useNotificationStore } from '@/stores';
import type { CreateMLModel } from '@/types/MLModel';

const CREATE_MODEL: TypedDocumentNode<CreateMLModel> = gql`
    mutation CreateModel($data: ModelInput!) {
        createModel(data: $data) {
            modelId
        }
    }
`;

export const useCreateModel = () => {
    const navigate = useNavigate();
    const { addNotification } = useNotificationStore();

    return useMutation(CREATE_MODEL, {
        onCompleted: () => navigate('/dashboard/models'),
        refetchQueries: ['ListMLModels'],
        onError: (error) =>
            addNotification({
                type: 'error',
                title: 'Error',
                // TODO: Change this type to just be a string
                children: error.message,
            }),
    });
};
