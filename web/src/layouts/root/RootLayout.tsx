import { Navigate } from 'react-router';

import { paths } from '@/config/paths';
import { useUser } from '@/features/auth/hooks/authHooks';

export const RootLayout = () => {
  const { user } = useUser();

  if (user) {
    return <Navigate to={paths.dashboard.overview.path} />;
  }

  return <Navigate to={paths.auth.login.path} />;
};
