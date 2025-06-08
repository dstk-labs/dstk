import { Navigate } from 'react-router';
import { useUser } from '../hooks/authHooks';
import { paths } from '@/config/paths';

export const PrivateRoute = ({ children }: React.PropsWithChildren) => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to={paths.auth.login.path} />;
  }

  return children;
};
