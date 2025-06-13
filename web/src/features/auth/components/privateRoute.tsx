import { Navigate } from 'react-router';

import { paths } from '@/config/paths';

import { useUser } from '../hooks/authHooks';

export const PrivateRoute = ({ children }: React.PropsWithChildren) => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to={paths.auth.login.path} />;
  }

  return children;
};
