import { gql, useMutation, type TypedDocumentNode } from '@apollo/client';

import { useNotificationStore } from '@/stores';
import type { CreateAPIKey } from '@/types/APIKey';

const CREATE_API_KEY: TypedDocumentNode<CreateAPIKey> = gql`
    mutation CreateApiKey {
        createApiKey {
            apiKeyId
        }
    }
`;

export const useCreateAPIKey = () => {
    const { addNotification } = useNotificationStore();

    return useMutation(CREATE_API_KEY, {
        refetchQueries: ['ListApiKeys'],
        onCompleted: () =>
            addNotification({
                type: 'success',
                title: 'Successfully provisioned new API key.',
            }),
        onError: (error) =>
            addNotification({
                type: 'error',
                title: 'Error',
                children: error.message,
            }),
    });
};
