import { AppShell, Box, Burger, Group, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { Navigate, Outlet } from 'react-router';

import { paths } from '@/config/paths';
import { useUser } from '@/features/auth/hooks/authHooks';

import { DashboardBreadcrumbs } from './DashboardBreadcrumbs';
import styles from './DashboardLayout.module.css';
import { DashboardNavigation } from './DashboardNavigation';
import { DashboardToolbar } from './DashboardToolbar';
import { TeamSelect } from './TeamSelect';
import { UserButton } from './UserButton';

export const DashboardLayout = () => {
  const { user } = useUser();

  const [opened, { toggle }] = useDisclosure();
  const [visible, setVisible] = useState(false);

  if (!user) {
    return <Navigate to={paths.auth.login.path} />;
  }

  return (
    <Box pos='relative'>
      <LoadingOverlay
        overlayProps={{ blur: 2, radius: 'sm' }}
        visible={visible}
        zIndex={1000}
      />
      <AppShell
        header={{ height: 71 }}
        layout='alt'
        navbar={{
          breakpoint: 'md',
          collapsed: { mobile: !opened },
          width: 300,
        }}
        padding='md'
      >
        <AppShell.Header>
          <Group h='100%' justify='space-between' px='md'>
            <Group>
              <Burger
                hiddenFrom='md'
                onClick={toggle}
                opened={opened}
                size='sm'
              />
              <DashboardBreadcrumbs />
            </Group>
            <DashboardToolbar />
          </Group>
        </AppShell.Header>
        <AppShell.Navbar className={styles.navbar}>
          <div className={styles.section}>
            <UserButton setIsLoading={setVisible} />
          </div>

          <TeamSelect />

          <DashboardNavigation />

          <Box className={styles.footer} component='footer' hiddenFrom='md'>
            <div className={styles.footerInner}>
              <Burger onClick={toggle} opened={opened} size='sm' />
            </div>
          </Box>
        </AppShell.Navbar>
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </Box>
  );
};
