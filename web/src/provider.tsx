import { ApolloProvider } from '@apollo/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { apolloClient } from './lib/apollo';

export const AppProvider = ({ children }: React.PropsWithChildren) => (
  <ApolloProvider client={apolloClient}>
    <MantineProvider defaultColorScheme='light'>
      <Notifications />
      {children}
    </MantineProvider>
  </ApolloProvider>
);
