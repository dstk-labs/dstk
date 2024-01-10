import { ApolloProvider as Provider } from '@apollo/client';

import { apolloClient } from '@/lib/apolloClient';

type ApolloProviderProps = {
    children: React.ReactNode;
};

export const ApolloProvider = ({ children }: ApolloProviderProps) => {
    return <Provider client={apolloClient}>{children}</Provider>;
};
