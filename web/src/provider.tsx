import { ApolloProvider } from "@apollo/client";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import { apolloClient } from "./lib/apollo";
import { cssVariablesResolver, theme } from "./theme";

export function AppProvider({ children }: React.PropsWithChildren) {
  return (
    <ApolloProvider client={apolloClient}>
      <MantineProvider
        cssVariablesResolver={cssVariablesResolver}
        defaultColorScheme="dark"
        forceColorScheme="dark"
        theme={theme}
      >
        <Notifications position="bottom-right" />
        {children}
      </MantineProvider>
    </ApolloProvider>
  );
}
