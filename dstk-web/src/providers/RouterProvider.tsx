import { createBrowserRouter, RouterProvider as Router } from 'react-router-dom';

import { Dashboard } from '../routes/dashboard';

// TODO: Will modularize this with protected / public routes whenever we get there
export const RouterProvider = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <div>Welcome to dstk!</div>,
        },
        {
            path: '/dashboard',
            element: <Dashboard />,
        },
    ]);

    return <Router router={router} />;
};
