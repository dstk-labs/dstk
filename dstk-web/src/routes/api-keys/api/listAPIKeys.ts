import { gql, useQuery, type TypedDocumentNode } from '@apollo/client';

import { useNotificationStore } from '@/stores';
import type { APIKeyList } from '@/types/APIKey';

const LIST_API_KEYS: TypedDocumentNode<APIKeyList> = gql`
    query ListApiKeys {
        listApiKeys {
            apiKey
            apiKeyId
            dateCreated
            isArchived
        }
    }
`;

export const useListAPIKeys = () => {
    const { addNotification } = useNotificationStore();

    return useQuery(LIST_API_KEYS, {
        onError: (error) =>
            addNotification({
                type: 'error',
                title: 'Error',
                children: error.message,
            }),
    });
};
