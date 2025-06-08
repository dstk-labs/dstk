import { DotIcon, MoonIcon, SunIcon } from 'lucide-react';
import { AppShell, Center, Group, ScrollArea, useMantineColorScheme } from '@mantine/core';
import { Anchor } from '@/components/anchor/anchor';
import { Outlet } from 'react-router';
import { Fragment } from 'react/jsx-runtime';
import { Logo } from '@/components/logo/logo';
import { paths } from '@/config/paths';
import styles from './authLayout.module.css';
import { PublicRoute } from '@/features/auth/components/publicRoute';

const footerLinks = [
  { link: paths.root.landing.path, label: `© ${new Date().getFullYear()} DSTK Labs.`},
  { link: paths.root.about.path, label: 'About' },
  { link: paths.root.terms.path, label: 'Terms' },
  { link: paths.root.privacy.path, label: 'Privacy' },
  { link: paths.root.careers.path, label: 'Careers' },
];

export const AuthLayout = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <PublicRoute>
      <AppShell
        header={{ height: 60 }}
        footer={{ height: 60 }}
        padding="md"
      >
        <AppShell.Header>
          <Center h="100%">
            <Logo h="auto" w="2rem" />
          </Center>
        </AppShell.Header>
        <AppShell.Main>
          <Center className={styles.main}>
            <Outlet />
          </Center>
        </AppShell.Main>
        <AppShell.Footer>
          <Center h="100%">
            <ScrollArea py="lg">
              <Group px="lg" wrap="nowrap">
                {footerLinks.map(footerLink => (
                  <Fragment key={footerLink.link}>
                    <Anchor
                      c="gray"
                      className={styles.anchor}
                      size="xs"
                      to={footerLink.link}
                    >
                      {footerLink.label}
                    </Anchor>
                    <Anchor
                      c="gray"
                      component="li"
                      underline="never"
                    >
                      <DotIcon size={14} />
                    </Anchor>
                  </Fragment>
                ))}
                <Anchor
                  c="gray"
                  component="button"
                  underline="never"
                >
                  {colorScheme === 'light' ? (
                    <MoonIcon onClick={() => setColorScheme('dark')} size={14} />
                  ) : (
                    <SunIcon onClick={() => setColorScheme('light')} size={14} />
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
