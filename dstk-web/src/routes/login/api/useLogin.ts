import { gql, useMutation, type TypedDocumentNode } from '@apollo/client';

const LOGIN: TypedDocumentNode<{ login: string }> = gql`
    mutation Login($data: LoginInput!) {
        login(data: $data)
    }
`;

export const useLogin = () => useMutation(LOGIN);
