import { useSetAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { useNavigate } from 'react-router-dom';

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
