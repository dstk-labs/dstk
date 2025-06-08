import { PrivateRoute } from '@/features/auth/components/privateRoute';
import { Outlet } from 'react-router';

export const DashboardLayout = () => (
  <PrivateRoute>
    <Outlet />
  </PrivateRoute>
);
