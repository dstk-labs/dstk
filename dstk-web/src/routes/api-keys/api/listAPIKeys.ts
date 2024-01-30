import { gql, useQuery, type TypedDocumentNode } from '@apollo/client';

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

export const useListAPIKeys = () => useQuery(LIST_API_KEYS);
