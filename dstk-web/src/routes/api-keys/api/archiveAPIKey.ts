import { gql, useMutation, type TypedDocumentNode } from '@apollo/client';

import { useNotificationStore } from '@/stores';
import type { ArchiveAPIKey } from '@/types/APIKey';

const ARCHIVE_API_KEY: TypedDocumentNode<ArchiveAPIKey> = gql`
    mutation ArchiveApiKey($apiKeyId: String!) {
        archiveApiKey(apiKeyId: $apiKeyId) {
            apiKeyId
        }
    }
`;

export const useArchiveAPIKey = () => {
    const { addNotification } = useNotificationStore();

    return useMutation(ARCHIVE_API_KEY, {
        refetchQueries: ['ListApiKeys'],
        onError: (error) =>
            addNotification({
                type: 'error',
                title: 'Error',
                children: error.message,
            }),
    });
};
