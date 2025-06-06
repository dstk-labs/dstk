import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

export const AppProvider = ({ children }: React.PropsWithChildren) => (
  <MantineProvider>
    <Notifications />
    {children}
  </MantineProvider>
);
