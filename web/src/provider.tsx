import { MantineProvider } from '@mantine/core';

export const AppProvider = ({ children }: React.PropsWithChildren) => (
  <MantineProvider>{children}</MantineProvider>
);
