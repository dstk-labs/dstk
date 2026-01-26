import { AppShell, Center, Group, ScrollArea } from "@mantine/core";
import { DotIcon } from "lucide-react";
import { Navigate, Outlet } from "react-router";
import { Fragment } from "react/jsx-runtime";

import { Anchor } from "@/components/anchor/Anchor";
import { Logo } from "@/components/logo/Logo";
import { paths } from "@/config/paths";
import { useUser } from "@/features/auth/hooks/authHooks";

import styles from "./AuthLayout.module.css";

const footerLinks = [
  {
    label: `© ${new Date().getFullYear()} DSTK Labs.`,
    link: paths.root.landing.path,
  },
  { label: "About", link: paths.root.about.path },
  { label: "Terms", link: paths.root.terms.path },
  { label: "Privacy", link: paths.root.privacy.path },
  { label: "Careers", link: paths.root.careers.path },
];

export function AuthLayout() {
  const { user } = useUser();

  if (user) {
    if (!user.isEmailVerified) {
      return <Navigate to={paths.auth.verify.path} />;
    }
    return <Navigate to={paths.dashboard.overview.path} />;
  }

  return (
    <AppShell footer={{ height: 60 }} header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Center h="100%">
          <Logo h="auto" w="2rem" />
        </Center>
      </AppShell.Header>
      <AppShell.Main>
        <Center className={styles.main} my="xl">
          <Outlet />
        </Center>
      </AppShell.Main>
      <AppShell.Footer>
        <Center h="100%">
          <ScrollArea py="lg">
            <Group px="lg" wrap="nowrap">
              {footerLinks.map((footerLink, index) => (
                <Fragment key={footerLink.link}>
                  <Anchor
                    c="gray"
                    className={styles.anchor}
                    size="xs"
                    to={footerLink.link}
                  >
                    {footerLink.label}
                  </Anchor>
                  {index !== footerLinks.length - 1 && (
                    <Anchor c="gray" component="li" underline="never">
                      <DotIcon size={14} />
                    </Anchor>
                  )}
                </Fragment>
              ))}
            </Group>
          </ScrollArea>
        </Center>
      </AppShell.Footer>
    </AppShell>
  );
}
