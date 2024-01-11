import { gql, useQuery, type TypedDocumentNode } from '@apollo/client';

import { useNotificationStore } from '@/stores';
import type { StorageProviderList } from '@/types/StorageProvider';

const LIST_STORAGE_PROVIDERS: TypedDocumentNode<StorageProviderList> = gql`
    query ListStorageProviders {
        listStorageProviders {
            providerId
            bucket
        }
    }
`;

export const useListStorageProviders = () => {
    const { addNotification } = useNotificationStore();

    return useQuery(LIST_STORAGE_PROVIDERS, {
        onError: (error) =>
            addNotification({
                type: 'error',
                title: 'Error',
                children: error.message,
            }),
    });
};
