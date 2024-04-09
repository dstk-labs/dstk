import { Toaster } from 'sonner';

import { ApolloProvider, RouterProvider, ThemeProvider } from '@/providers';

export default function App() {
    return (
        <ApolloProvider>
            <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
                <Toaster />
                <RouterProvider />
            </ThemeProvider>
        </ApolloProvider>
    );
}
