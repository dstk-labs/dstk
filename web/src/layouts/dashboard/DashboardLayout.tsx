import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Navigate, Outlet } from "react-router";

import { paths } from "@/config/paths";
import { useUser } from "@/features/auth/hooks/authHooks";

import { DashboardBreadcrumbs } from "./DashboardBreadcrumbs";
import styles from "./DashboardLayout.module.css";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function DashboardLayout() {
  const { user } = useUser();
  const [opened, { close, toggle }] = useDisclosure();

  if (!user) {
    return <Navigate to={paths.auth.login.path} />;
  }

  if (!user.isEmailVerified) {
    return <Navigate to={paths.auth.verify.path} />;
  }

  return (
    <AppShell
      header={{ height: 60 }}
      layout="alt"
      navbar={{
        breakpoint: "md",
        collapsed: { mobile: !opened },
        width: 260,
      }}
      padding={{ base: "md", md: "xl" }}
    >
      <AppShell.Header className={styles.header}>
        <Topbar onToggleSidebar={toggle} sidebarOpened={opened} />
      </AppShell.Header>
      <AppShell.Navbar className={styles.navbar}>
        <Sidebar onNavigate={close} user={user} />
      </AppShell.Navbar>
      <AppShell.Main className={styles.main}>
        <DashboardBreadcrumbs />
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
