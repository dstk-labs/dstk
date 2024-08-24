import {
    ApolloClient,
    createHttpLink,
    createQueryPreloader,
    from,
    InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { toast } from 'sonner';

// TODO: Dynamically define this based on env
const httpLink = createHttpLink({
    uri: 'http://localhost:4000',
});

// TODO: Revisit for error categorization? Probably moot but not dismissing just yet.
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.map((error) => toast.error(error.message));
    }

    if (networkError) {
        toast.error(networkError.message);
    }
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${JSON.parse(token)}` : '',
        },
    };
});

export const apolloClient = new ApolloClient({
    link: from([authLink, errorLink, httpLink]),
    cache: new InMemoryCache(),
});

export const preloadQuery = createQueryPreloader(apolloClient);
