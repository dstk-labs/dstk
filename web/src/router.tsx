import { useMemo } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { paths } from './config/paths';

// TODO: 404 and Error Boundaries
const createAppRouter = () =>
  createBrowserRouter([
    {
      lazy: async () => {
        const { AuthLayout } = await import('./layouts/auth/authLayout');
        return { Component: AuthLayout };
      },
      children: [
        {
          path: paths.auth.login.path,
          lazy: async () => {
            const { LoginPage } = await import('./pages/auth/login/loginPage');
            return { Component: LoginPage };
          },
        },
      ]
    },
    {
      path: paths.root.landing.path,
      lazy: async () => {
        const { LandingPage } = await import('./pages/root/landing-page');
        return { Component: LandingPage };
      },
    },
  ]);

export const AppRouter = () => {
  const router = useMemo(() => createAppRouter(), []);

  return <RouterProvider router={router} />;
};
