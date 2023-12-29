import { createBrowserRouter, RouterProvider as Router } from 'react-router-dom';

import { DashboardLayout } from '@/components/layout';
import {
    CreateModel,
    CreateModelVersion,
    Home,
    ModelRegistry,
    ModelVersion,
    ModelVersionDetails,
    UploadFiles,
} from '@/routes';

// TODO: Will modularize this with protected / public routes whenever we get there
export const RouterProvider = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <div>Welcome to dstk!</div>,
        },
        {
            element: <DashboardLayout />,
            path: '/dashboard',
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
            ],
        },
    ]);

    return <Router router={router} />;
};
