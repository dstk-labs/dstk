import { createBrowserRouter, RouterProvider as Router } from 'react-router-dom';

import { PrivateRoute, PublicRoute } from '@/components/auth';
import { DashboardLayout } from '@/components/layout';
import {
    CreateModel,
    CreateModelVersion,
    EditModel,
    Home,
    Login,
    ModelRegistry,
    ModelVersion,
    ModelVersionDetails,
    Register,
    UploadFiles,
    UserSettings,
} from '@/routes';

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
                    children: [
                        {
                            path: '/dashboard/home',
                            element: <Home />,
                        },
                        {
                            path: '/dashboard/models',
                            element: <ModelRegistry />,
                        },
                        {
                            path: '/dashboard/models/create',
                            element: <CreateModel />,
                        },
                        {
                            path: '/dashboard/models/:modelId',
                            element: <ModelVersion />,
                        },
                        {
                            path: '/dashboard/models/:modelId/edit',
                            element: <EditModel />,
                        },
                        {
                            path: '/dashboard/models/:modelId/create',
                            element: <CreateModelVersion />,
                        },
                        {
                            path: '/dashboard/models/:modelId/:versionId',
                            element: <ModelVersionDetails />,
                        },
                        {
                            path: '/dashboard/models/:modelId/:versionId/upload',
                            element: <UploadFiles />,
                        },
                        {
                            path: '/settings',
                            element: <UserSettings />,
                        },
                    ],
                },
            ],
        },
    ]);

    return <Router router={router} />;
};
