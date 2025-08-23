import { useMemo } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { paths } from './config/paths';
import { userLoader } from './features/auth/loaders/authLoader';
import { GET_ML_MODEL } from './features/models/loaders/modelLoader';
import { GET_ML_MODEL_VERSION } from './features/modelVersions/loaders/modelVersionLoader';
import { GetMlModelQuery } from './graphql/types';
import { apolloClient } from './lib/apollo';

// TODO: This is getting hard to read. Need to refactor
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
              children: [
                {
                  id: 'models',
                  index: true,
                  lazy: async () => {
                    const { ModelsPage } = await import(
                      './pages/dashboard/models/root/ModelsPage'
                    );
                    return { Component: ModelsPage };
                  },
                  loader: async (params) => {
                    const { modelsLoader } = await import(
                      './features/models/loaders/modelsLoader'
                    );

                    const queryRef = await modelsLoader(params);
                    return queryRef;
                  },
                },
                {
                  children: [
                    {
                      index: true,
                      lazy: async () => {
                        const { ModelVersionsPage } = await import(
                          './pages/dashboard/models/modelVersions/root/ModelVersionsPage'
                        );
                        return { Component: ModelVersionsPage };
                      },
                    },
                    {
                      children: [
                        {
                          lazy: async () => {
                            const { ModelVersionArtifactsPage } = await import(
                              './pages/dashboard/models/modelVersions/modelVersion/artifacts/ModelVersionArtifactsPage'
                            );
                            return { Component: ModelVersionArtifactsPage };
                          },
                          loader: async (params) => {
                            const { modelVersionObjectsLoader } = await import(
                              './features/modelVersions/loaders/modelVersionObjectsLoader'
                            );

                            const queryRef =
                              await modelVersionObjectsLoader(params);
                            return queryRef;
                          },
                          path: paths.dashboard.modelVersionArtifacts.path,
                        },
                        {
                          lazy: async () => {
                            const { ModelVersionCardPage } = await import(
                              './pages/dashboard/models/modelVersions/modelVersion/card/ModelVersionCardPage'
                            );
                            return { Component: ModelVersionCardPage };
                          },
                          path: paths.dashboard.modelVersionCard.path,
                        },
                        {
                          lazy: async () => {
                            const { ModelVersionLogsPage } = await import(
                              './pages/dashboard/models/modelVersions/modelVersion/logs/ModelVersionLogsPage'
                            );
                            return { Component: ModelVersionLogsPage };
                          },
                          path: paths.dashboard.modelVersionLogs.path,
                        },
                      ],
                      handle: {
                        crumb: () => {
                          const modelVersionId = window.location.href
                            .split('/')
                            .at(6)
                            ?.split('?')
                            .at(0);

                          const result = apolloClient.readQuery({
                            query: GET_ML_MODEL_VERSION,
                            variables: {
                              modelVersionId: modelVersionId ?? '',
                            },
                          });

                          return `v${result?.getMLModelVersion?.numericVersion}`;
                        },
                      },
                      lazy: async () => {
                        const { ModelVersionLayout } = await import(
                          './layouts/model-version/ModelVersionLayout'
                        );
                        return { Component: ModelVersionLayout };
                      },
                      loader: async (params) => {
                        const { modelVersionLoader } = await import(
                          './features/modelVersions/loaders/modelVersionLoader'
                        );

                        const queryRef = await modelVersionLoader({
                          modelVersionId: params.params.modelVersionId!,
                        });

                        return queryRef;
                      },
                    },
                  ],
                  handle: {
                    crumb: () => {
                      // TODO: This is causing issues
                      const modelId = window.location.href
                        .split('/')
                        .at(5)
                        ?.split('?')
                        .at(0);

                      const result = apolloClient.readQuery({
                        query: GET_ML_MODEL,
                        variables: {
                          modelId: modelId!,
                        },
                      }) as GetMlModelQuery;

                      return result?.getMLModel?.modelName ?? '';
                    },
                  },
                  id: 'model',
                  loader: async (params) => {
                    const { modelVersionsLoader } = await import(
                      './features/modelVersions/loaders/modelVersionsLoader'
                    );

                    const { modelLoader } = await import(
                      './features/models/loaders/modelLoader'
                    );

                    const [modelVersionsQueryRef, modelQueryRef] =
                      await Promise.all([
                        await modelVersionsLoader(params),
                        await modelLoader({
                          modelId: params.params.modelId!,
                        }),
                      ]);

                    return [modelVersionsQueryRef, modelQueryRef];
                  },
                  path: paths.dashboard.model.path,
                },
              ],
              handle: {
                crumb: () => 'Models',
              },
              path: paths.dashboard.models.path,
            },
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
            {
              handle: {
                crumb: () => 'Teams',
              },
              lazy: async () => {
                const { TeamsPage } = await import(
                  './pages/dashboard/teams/TeamsPage'
                );
                return { Component: TeamsPage };
              },
              loader: async (params) => {
                const { teamsTableLoader } = await import(
                  './features/teams/loaders/teamsLoader'
                );

                const queryRef = await teamsTableLoader(params);
                return queryRef;
              },
              path: paths.dashboard.teams.path,
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
            const { teamsDropdownLoader } = await import(
              './features/teams/loaders/teamsLoader'
            );

            const queryRef = teamsDropdownLoader();
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
