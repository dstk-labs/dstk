import { ApolloProvider, RouterProvider } from '@/providers';
import { Notifications } from '@/components/notifications';

export default function App() {
    return (
        <ApolloProvider>
            <Notifications />
            <RouterProvider />
        </ApolloProvider>
    );
}
