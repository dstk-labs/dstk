import { gql, useMutation, type TypedDocumentNode } from '@apollo/client';

import { useNotificationStore } from '@/stores';
import type { CreateAccount } from '@/types/User';

const CREATE_ACCOUNT: TypedDocumentNode<CreateAccount> = gql`
    mutation CreateAccount($data: AccountInput!) {
        createAccount(data: $data) {
            userId
        }
    }
`;

export const useCreateAccount = () => {
    const { addNotification } = useNotificationStore();

    return useMutation(CREATE_ACCOUNT, {
        onError: (error) =>
            addNotification({
                type: 'error',
                title: 'Error',
                children: error.message,
            }),
    });
};
