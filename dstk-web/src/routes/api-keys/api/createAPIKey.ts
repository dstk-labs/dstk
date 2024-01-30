import { gql, useMutation, type TypedDocumentNode } from '@apollo/client';
import { toast } from 'sonner';

import type { CreateAPIKey } from '@/types/APIKey';

const CREATE_API_KEY: TypedDocumentNode<CreateAPIKey> = gql`
    mutation CreateApiKey {
        createApiKey {
            apiKeyId
        }
    }
`;

export const useCreateAPIKey = () => {
    return useMutation(CREATE_API_KEY, {
        refetchQueries: ['ListApiKeys'],
        onCompleted: () => toast.success('Successfully provisioned new API Key.'),
    });
};
