import { gql, useMutation, type TypedDocumentNode } from '@apollo/client';

import type { CreateAccount } from '@/types/User';

const CREATE_ACCOUNT: TypedDocumentNode<CreateAccount> = gql`
    mutation CreateAccount($data: AccountInput!) {
        createAccount(data: $data) {
            userId
        }
    }
`;

export const useCreateAccount = () => useMutation(CREATE_ACCOUNT);
