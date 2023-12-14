import { createBrowserRouter, RouterProvider as Router } from 'react-router-dom';

// TODO: Will modularize this with protected / public routes whenever we get there
export const RouterProvider = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <div>Welcome to dstk!</div>,
        },
        {
            path: '/dashboard',
            element: <div>Welcome to dashboard!</div>,
        },
    ]);

    return <Router router={router} />;
};
