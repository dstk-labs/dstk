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
          lazy: async () => {
            const { RootLayout } = await import('./layouts/root/RootLayout');

            return { Component: RootLayout };
          },
          path: paths.root.landing.path,
        },
        {
          children: [
            {
              lazy: async () => {
                const { LoginPage } = await import(
                  './pages/auth/login/LoginPage'
                );
                return { Component: LoginPage };
              },
              path: paths.auth.login.path,
            },
            {
              lazy: async () => {
                const { RegisterPage } = await import(
                  './pages/auth/register/RegisterPage'
                );
                return { Component: RegisterPage };
              },
              path: paths.auth.register.path,
            },
          ],
          lazy: async () => {
            const { AuthLayout } = await import('./layouts/auth/AuthLayout');
            return { Component: AuthLayout };
          },
        },
        {
          children: [
            {
              handle: {
                crumb: () => 'Overview',
              },
              lazy: async () => {
                const { OverviewPage } = await import(
                  './pages/dashboard/overview/OverviewPage'
                );
                return { Component: OverviewPage };
              },
              path: paths.dashboard.overview.path,
            },
            {
              handle: {
                crumb: () => 'Projects',
              },
              lazy: async () => {
                const { ProjectsPage } = await import(
                  './pages/dashboard/projects/ProjectsPage'
                );
                return { Component: ProjectsPage };
              },
              loader: async (params) => {
                const { projectsLoader } = await import(
                  './features/projects/loaders/projectsLoader'
                );

                const queryRef = await projectsLoader(params);
                return queryRef;
              },
              path: paths.dashboard.projects.path,
            },
            {
              handle: {
                crumb: () => 'Storage',
              },
              lazy: async () => {
                const { StorageProvidersPage } = await import(
                  './pages/dashboard/storage/StorageProvidersPage'
                );
                return { Component: StorageProvidersPage };
              },
              loader: async (params) => {
                const { storageProvidersLoader } = await import(
                  './features/storage/loaders/storageProvidersLoader'
                );

                const queryRef = await storageProvidersLoader(params);
                return queryRef;
              },
              path: paths.dashboard.storage.path,
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
      ],
      // TODO: What is good UX for this?
      hydrateFallbackElement: <div>Loading...</div>,
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
