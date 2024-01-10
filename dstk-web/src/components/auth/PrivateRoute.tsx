import { Outlet, Navigate } from 'react-router-dom';

import { useAuth } from '@/hooks';

export const PrivateRoute = () => {
    const token = useAuth();

    return token ? <Outlet /> : <Navigate to='/login' />;
};
