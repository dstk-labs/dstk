import {
    createBrowserRouter,
    RouterProvider as Router,
    type LoaderFunctionArgs,
} from 'react-router-dom';

import { PrivateRoute, PublicRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import {
    AddTeamMember,
    APIKeys,
    CreateModel,
    CreateTeam,
    EditModel,
    Home,
    Login,
    ModelRegistry,
    ModelVersionDetails,
    Register,
    TeamDetails,
    Teams,
    UploadFiles,
    UserSettings,
} from '@/routes';
import type { MLModelVersion, Team } from '@/types/api';
import { modelLoader } from '../routes/model-versions/ModelVersionsRoute';
import { apolloClient } from '@/lib';
import { GET_MODEL } from '@/features/model/api/getModel';

export const RouterProvider = () => {
    const router = createBrowserRouter([
        {
            element: <PublicRoute />,
            children: [
                {
                    path: '/',
                    element: <div>Welcome to dstk!</div>,
                },
                {
                    path: '/login',
                    element: <Login />,
                },
                {
                    path: '/register',
                    element: <Register />,
                },
            ],
        },
        {
            element: <PrivateRoute />,
            children: [
                {
                    element: <DashboardLayout />,
                    handle: {
                        crumb: () => 'Home',
                    },
                    children: [
                        {
                            path: '/dashboard/home',
                            element: <Home />,
                        },
                        {
                            path: '/dashboard/models',
                            handle: {
                                crumb: () => 'Models',
                            },
                            children: [
                                {
                                    element: <ModelRegistry />,
                                    index: true,
                                },
                                {
                                    path: '/dashboard/models/create',
                                    element: <CreateModel />,
                                    handle: {
                                        crumb: () => 'Create',
                                    },
                                },
                                {
                                    path: '/dashboard/models/:modelId',
                                    handle: {
                                        crumb: () => {
                                            const modelId = window.location.href.split('/').at(5);
                                            const data = apolloClient.readQuery({
                                                query: GET_MODEL,
                                                variables: {
                                                    modelId: modelId,
                                                },
                                            });

                                            return data?.getMLModel.modelName;
                                        },
                                    },
                                    children: [
                                        {
                                            lazy: async () => {
                                                const { ModelVersionsRoute } = await import(
                                                    '../routes/model-versions/ModelVersionsRoute'
                                                );
                                                return { Component: ModelVersionsRoute };
                                            },
                                            loader: async (args: LoaderFunctionArgs) => {
                                                return modelLoader(args);
                                            },
                                            index: true,
                                        },
                                        {
                                            path: '/dashboard/models/:modelId/edit',
                                            element: <EditModel />,
                                            handle: {
                                                crumb: () => 'Edit',
                                            },
                                        },
                                        {
                                            path: '/dashboard/models/:modelId/create',
                                            lazy: async () => {
                                                const { CreateModelVersionRoute } = await import(
                                                    '../routes/create-model-version/CreateModelVersionRoute'
                                                );
                                                return { Component: CreateModelVersionRoute };
                                            },
                                            handle: {
                                                crumb: () => 'Create',
                                            },
                                        },
                                        {
                                            path: '/dashboard/models/:modelId/:versionId',
                                            handle: {
                                                crumb: (data?: MLModelVersion) =>
                                                    (data && `v${data.numericVersion}`) ||
                                                    'Async is super duper fun',
                                            },
                                            children: [
                                                {
                                                    element: <ModelVersionDetails />,
                                                    index: true,
                                                },
                                                {
                                                    path: '/dashboard/models/:modelId/:versionId/upload',
                                                    element: <UploadFiles />,
                                                    handle: {
                                                        crumb: () => 'Upload Files',
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            path: 'dashboard/teams',
                            handle: {
                                crumb: () => 'Teams',
                            },
                            children: [
                                {
                                    element: <Teams />,
                                    index: true,
                                },
                                {
                                    path: 'dashboard/teams/create',
                                    element: <CreateTeam />,
                                    handle: {
                                        crumb: () => 'Create',
                                    },
                                },
                                {
                                    path: 'dashboard/teams/:teamId',
                                    handle: {
                                        crumb: (data?: Team) =>
                                            (data && data.name) || 'BILLIE JEAN',
                                    },
                                    children: [
                                        {
                                            element: <TeamDetails />,
                                            index: true,
                                        },
                                        {
                                            path: 'dashboard/teams/:teamId/add-member',
                                            element: <AddTeamMember />,
                                            handle: {
                                                crumb: () => 'Add Team Member',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            path: 'dashboard/settings',
                            handle: {
                                crumb: () => 'Settings',
                            },
                            children: [
                                {
                                    element: <UserSettings />,
                                    index: true,
                                },
                                {
                                    path: 'dashboard/settings/api-keys',
                                    element: <APIKeys />,
                                    handle: {
                                        crumb: () => 'API Keys',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ]);

    return <Router router={router} />;
};
