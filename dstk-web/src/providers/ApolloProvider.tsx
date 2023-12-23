import { ApolloClient, InMemoryCache, ApolloProvider as Provider } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:4000',
    cache: new InMemoryCache(),
});

type ApolloProviderProps = {
    children: React.ReactNode;
};

export const ApolloProvider = ({ children }: ApolloProviderProps) => {
    return <Provider client={client}>{children}</Provider>;
};
