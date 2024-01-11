import { gql, useMutation, type TypedDocumentNode } from '@apollo/client';
import { useSetAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { useNavigate } from 'react-router-dom';

import { useNotificationStore } from '@/stores';
import { jwtAtom } from '@/atoms';
import { apolloClient } from '@/lib';

export const useAuth = () => {
    const token = localStorage.getItem('token');

    return !!token;
};

export const useLogout = () => {
    const navigate = useNavigate();
    const setToken = useSetAtom(jwtAtom);

    return () => {
        setToken(RESET);
        apolloClient.resetStore();
        navigate('/login');
    };
};

const LOGIN: TypedDocumentNode<{ login: string }> = gql`
    mutation Login($data: LoginInput!) {
        login(data: $data)
    }
`;

export const useLogin = () => {
    const navigate = useNavigate();
    const setToken = useSetAtom(jwtAtom);
    const { addNotification } = useNotificationStore();

    return useMutation(LOGIN, {
        onCompleted: (data) => {
            setToken(data.login);
            navigate('/dashboard/home');
        },
        onError: (error) =>
            addNotification({
                type: 'error',
                title: 'Error',
                children: error.message,
            }),
    });
};
