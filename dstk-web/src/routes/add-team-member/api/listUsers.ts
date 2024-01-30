import { gql, useQuery, type TypedDocumentNode } from '@apollo/client';

import type { ListUsers } from '@/types/User';

const LIST_USERS: TypedDocumentNode<ListUsers> = gql`
    query ListUsers {
        listUsers {
            userId
            userName
        }
    }
`;

export const useListUsers = () => useQuery(LIST_USERS);
