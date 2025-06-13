import { type PreloadedQueryRef, useReadQuery } from '@apollo/client';
import {
  AppShell,
  Box,
  Burger,
  Group,
  LoadingOverlay,
  Select,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { Outlet, useRouteLoaderData } from 'react-router';

import type { ListTeamsQuery } from '@/graphql/types';

import { PrivateRoute } from '@/features/auth/components/PrivateRoute';

import { DashboardBreadcrumbs } from './DashboardBreadcrumbs';
import styles from './DashboardLayout.module.css';
import { DashboardNavigation } from './DashboardNavigation';
import { DashboardToolbar } from './DashboardToolbar';
import { UserButton } from './UserButton';

export const DashboardLayout = () => {
  const queryRef = useRouteLoaderData('dashboard') as PreloadedQueryRef<
    ListTeamsQuery,
    undefined
  >;
  const { data } = useReadQuery(queryRef);

  const [opened, { toggle }] = useDisclosure();
  const [visible, setVisible] = useState(false);

  return (
    <PrivateRoute>
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

            <Select
              data={data.listTeams?.map((team) => team.name ?? '')}
              mb='sm'
              size='sm'
            />

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
    </PrivateRoute>
  );
};
