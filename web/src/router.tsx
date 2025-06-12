import { useMemo } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { paths } from './config/paths';
import { userLoader } from './features/auth/loaders/authLoader';

// TODO: 404 and Error Boundaries
const createAppRouter = () =>
  createBrowserRouter([
    {
      id: 'root',
      loader: async () => {
        const queryRef = await userLoader();
        return queryRef;
      },
      children: [
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
            {
              path: paths.auth.register.path,
              lazy: async () => {
                const { RegisterPage } = await import('./pages/auth/register/registerPage');
                return { Component: RegisterPage };
              },
            },
          ]
        },
        {
          id: 'dashboard',
          lazy: async () => {
            const { DashboardLayout } = await import('./layouts/dashboard/DashboardLayout');
            return { Component: DashboardLayout };
          },
          loader: async () => {
            const { teamsLoader } = await import('./features/teams/loaders/teamsLoader');

            const queryRef = teamsLoader();
            return queryRef;
          },
          children: [
            {
              path: paths.dashboard.overview.path,
              handle: {
                crumb: () => paths.dashboard.overview.getPath(),
              },
              lazy: async () => {
                const { OverviewPage } = await import('./pages/dashboard/overview/overviewPage');
                return { Component: OverviewPage };
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
      ]
    }
  ]);

export const AppRouter = () => {
  const router = useMemo(() => createAppRouter(), []);

  return <RouterProvider router={router} />;
};
