import { gql, type TypedDocumentNode } from '@apollo/client';
import type { StorageProvider } from '@/types/api';

type ListStorageProvidersPick = Pick<StorageProvider, 'bucket' | 'providerId'>;

type ListStorageProviders = {
    listStorageProviders: ListStorageProvidersPick[];
};

export const LIST_STORAGE_PROVIDERS: TypedDocumentNode<ListStorageProviders> = gql`
    query ListStorageProviders {
        listStorageProviders {
            providerId
            bucket
        }
    }
`;
