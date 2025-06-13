import {
  AppShell,
  Center,
  Group,
  ScrollArea,
  useMantineColorScheme,
} from '@mantine/core';
import { DotIcon, MoonIcon, SunIcon } from 'lucide-react';
import { Outlet } from 'react-router';
import { Fragment } from 'react/jsx-runtime';

import { Anchor } from '@/components/anchor/anchor';
import { Logo } from '@/components/logo/logo';
import { paths } from '@/config/paths';
import { PublicRoute } from '@/features/auth/components/publicRoute';

import styles from './authLayout.module.css';

const footerLinks = [
  {
    label: `© ${new Date().getFullYear()} DSTK Labs.`,
    link: paths.root.landing.path,
  },
  { label: 'About', link: paths.root.about.path },
  { label: 'Terms', link: paths.root.terms.path },
  { label: 'Privacy', link: paths.root.privacy.path },
  { label: 'Careers', link: paths.root.careers.path },
];

export const AuthLayout = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <PublicRoute>
      <AppShell footer={{ height: 60 }} header={{ height: 60 }} padding='md'>
        <AppShell.Header>
          <Center h='100%'>
            <Logo h='auto' w='2rem' />
          </Center>
        </AppShell.Header>
        <AppShell.Main>
          <Center className={styles.main} my='xl'>
            <Outlet />
          </Center>
        </AppShell.Main>
        <AppShell.Footer>
          <Center h='100%'>
            <ScrollArea py='lg'>
              <Group px='lg' wrap='nowrap'>
                {footerLinks.map((footerLink) => (
                  <Fragment key={footerLink.link}>
                    <Anchor
                      c='gray'
                      className={styles.anchor}
                      size='xs'
                      to={footerLink.link}
                    >
                      {footerLink.label}
                    </Anchor>
                    <Anchor c='gray' component='li' underline='never'>
                      <DotIcon size={14} />
                    </Anchor>
                  </Fragment>
                ))}
                <Anchor c='gray' component='button' underline='never'>
                  {colorScheme === 'light' ? (
                    <MoonIcon
                      onClick={() => setColorScheme('dark')}
                      size={14}
                    />
                  ) : (
                    <SunIcon
                      onClick={() => setColorScheme('light')}
                      size={14}
                    />
                  )}
                </Anchor>
              </Group>
            </ScrollArea>
          </Center>
        </AppShell.Footer>
      </AppShell>
    </PublicRoute>
  );
};
