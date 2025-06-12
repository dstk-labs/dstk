import {
  AppShell,
  Box,
  Burger,
  Group,
  LoadingOverlay,
  Select,
} from '@mantine/core';
import { UserButton } from './UserButton';
import { PrivateRoute } from '@/features/auth/components/privateRoute';
import {
  Outlet,
  useRouteLoaderData
} from 'react-router';
import { useDisclosure } from '@mantine/hooks';
import { useReadQuery, type PreloadedQueryRef } from '@apollo/client';
import type { ListTeamsQuery } from '@/graphql/types';
import { useState } from 'react';
import { DashboardToolbar } from './DashboardToolbar';
import { DashboardBreadcrumbs } from './DashboardBreadcrumbs';
import { DashboardNavigation } from './DashboardNavigation';
import styles from './DashboardLayout.module.css';


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
      <Box pos="relative">
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <AppShell
          layout="alt"
          header={{ height: 71 }}
          navbar={{
            width: 300,
            breakpoint: 'md',
            collapsed: { mobile: !opened },
          }}
          padding="md"
        >
          <AppShell.Header>
            <Group h="100%" justify='space-between' px="md">
              <Group>
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="md"
                  size="sm"
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
              mb="sm"
              size="sm"
            />

            <DashboardNavigation />
            
            <Box component="footer" className={styles.footer} hiddenFrom="md">
              <div className={styles.footerInner}>
                <Burger opened={opened} onClick={toggle} size="sm" />
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
