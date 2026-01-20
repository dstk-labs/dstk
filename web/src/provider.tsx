import { ApolloProvider } from "@apollo/client";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import { apolloClient } from "./lib/apollo";

export function AppProvider({ children }: React.PropsWithChildren) {
  return (
    <ApolloProvider client={apolloClient}>
      <MantineProvider defaultColorScheme="dark">
        <Notifications />
        {children}
      </MantineProvider>
    </ApolloProvider>
  );
}
