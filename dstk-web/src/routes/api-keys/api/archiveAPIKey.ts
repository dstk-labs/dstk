import { gql, useMutation, type TypedDocumentNode } from '@apollo/client';

import type { ArchiveAPIKey } from '@/types/APIKey';

const ARCHIVE_API_KEY: TypedDocumentNode<ArchiveAPIKey> = gql`
    mutation ArchiveApiKey($apiKeyId: String!) {
        archiveApiKey(apiKeyId: $apiKeyId) {
            apiKeyId
        }
    }
`;

export const useArchiveAPIKey = () => {
    return useMutation(ARCHIVE_API_KEY, {
        refetchQueries: ['ListApiKeys'],
    });
};
