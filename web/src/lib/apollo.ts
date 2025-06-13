import {
  ApolloClient,
  createHttpLink,
  createQueryPreloader,
  from,
  InMemoryCache,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { notifications } from '@mantine/notifications';

import { API_URL } from '../config/env';

const httpLink = createHttpLink({
  credentials: 'include',
  uri: API_URL,
});

// TODO: Revisit for error categorization? Probably moot but not dismissing just yet.
// TODO: 401 Errors should probably navigate to home
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map((error) =>
      notifications.show({
        color: 'red',
        message: error.message,
        title: 'Error',
      }),
    );
  }

  if (networkError) {
    notifications.show({
      color: 'red',
      message: networkError.message,
      title: networkError.name,
    });
  }
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, httpLink]),
});

export const preloadQuery = createQueryPreloader(apolloClient);
