import { gql, useQuery, type TypedDocumentNode } from '@apollo/client';

import { useNotificationStore } from '@/stores';
import type { ListUsers } from '@/types/User';

const LIST_USERS: TypedDocumentNode<ListUsers> = gql`
    query ListUsers {
        listUsers {
            userId
            userName
        }
    }
`;

export const useListUsers = () => {
    const { addNotification } = useNotificationStore();

    return useQuery(LIST_USERS, {
        onError: (error) =>
            addNotification({
                type: 'error',
                title: 'Error',
                children: error.message,
            }),
    });
};
