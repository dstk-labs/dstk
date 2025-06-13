import { Navigate } from 'react-router';

import { paths } from '@/config/paths';

import { useUser } from '../hooks/authHooks';

export const PublicRoute = ({ children }: React.PropsWithChildren) => {
  const { user } = useUser();

  if (user) {
    return <Navigate to={paths.dashboard.overview.path} />;
  }

  return children;
};
