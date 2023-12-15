import { createBrowserRouter, RouterProvider as Router } from 'react-router-dom';

import { DashboardLayout } from '@/components/layout';
import { Home, ModelRegistry } from '@/routes';

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
            ],
        },
    ]);

    return <Router router={router} />;
};
