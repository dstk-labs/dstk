import { useMemo } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { paths } from './config/paths';
import { userLoader } from './features/auth/loaders/authLoader';

// TODO: 404 and Error Boundaries
const createAppRouter = () =>
  createBrowserRouter([
    {
      children: [
        {
          children: [
            {
              lazy: async () => {
                const { LoginPage } = await import(
                  './pages/auth/login/loginPage'
                );
                return { Component: LoginPage };
              },
              path: paths.auth.login.path,
            },
            {
              lazy: async () => {
                const { RegisterPage } = await import(
                  './pages/auth/register/registerPage'
                );
                return { Component: RegisterPage };
              },
              path: paths.auth.register.path,
            },
          ],
          lazy: async () => {
            const { AuthLayout } = await import('./layouts/auth/authLayout');
            return { Component: AuthLayout };
          },
        },
        {
          children: [
            {
              handle: {
                crumb: () => paths.dashboard.overview.getPath(),
              },
              lazy: async () => {
                const { OverviewPage } = await import(
                  './pages/dashboard/overview/overviewPage'
                );
                return { Component: OverviewPage };
              },
              path: paths.dashboard.overview.path,
            },
          ],
          id: 'dashboard',
          lazy: async () => {
            const { DashboardLayout } = await import(
              './layouts/dashboard/DashboardLayout'
            );
            return { Component: DashboardLayout };
          },
          loader: async () => {
            const { teamsLoader } = await import(
              './features/teams/loaders/teamsLoader'
            );

            const queryRef = teamsLoader();
            return queryRef;
          },
        },
        {
          lazy: async () => {
            const { LandingPage } = await import('./pages/root/landing-page');
            return { Component: LandingPage };
          },
          path: paths.root.landing.path,
        },
      ],
      id: 'root',
      loader: async () => {
        const queryRef = await userLoader();
        return queryRef;
      },
    },
  ]);

export const AppRouter = () => {
  const router = useMemo(() => createAppRouter(), []);

  return <RouterProvider router={router} />;
};
