import { ApolloProvider, RouterProvider } from '@/providers';

export default function App() {
    return (
        <ApolloProvider>
            <RouterProvider />
        </ApolloProvider>
    );
}
