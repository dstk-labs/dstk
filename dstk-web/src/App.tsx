import { Toaster } from 'sonner';

import { ApolloProvider, RouterProvider } from '@/providers';

export default function App() {
    return (
        <ApolloProvider>
            <Toaster />
            <RouterProvider />
        </ApolloProvider>
    );
}
