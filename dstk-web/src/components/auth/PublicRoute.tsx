import { Outlet, Navigate } from 'react-router-dom';

import { useAuth } from '@/hooks';

export const PublicRoute = () => {
    const token = useAuth();

    return token ? <Navigate to='/dashboard/home' /> : <Outlet />;
};
