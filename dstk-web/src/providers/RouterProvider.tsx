import { createBrowserRouter, RouterProvider as Router } from 'react-router-dom';

import { DashboardLayout } from '@/components/layout';
import { Home, ModelRegistry, ModelVersion } from '@/routes';

// TODO: Will modularize this with protected / public routes whenever we get there
export const RouterProvider = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <div>Welcome to dstk!</div>,
        },
        {
            element: <DashboardLayout />,
            children: [
                {
                    path: '/dashboard',
                    element: <Home />,
                },
                {
                    path: '/models',
                    element: <ModelRegistry />,
                },
                {
                    path: '/models/:modelId',
                    element: <ModelVersion />,
                },
            ],
        },
    ]);

    return <Router router={router} />;
};
