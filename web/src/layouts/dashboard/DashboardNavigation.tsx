import { Link, useLocation } from 'react-router';
import {
  ArchiveIcon,
  FileBoxIcon,
  FolderCodeIcon,
  GaugeIcon,
  RocketIcon,
  UsersRoundIcon,
} from 'lucide-react';
import { paths } from '@/config/paths';
import styles from './DashboardNavigation.module.css';
import { NavLink } from '@mantine/core';

const links = [
  { icon: GaugeIcon, label: 'Overview', to: paths.dashboard.overview.path },
  {
    icon: FileBoxIcon,
    label: 'Model Registry',
    to: paths.dashboard.models.path,
  },
  {
    icon: RocketIcon,
    label: 'Deployments',
    to: paths.dashboard.deployments.path,
  },
  { icon: ArchiveIcon, label: 'Storage', to: paths.dashboard.storage.path },
  { icon: UsersRoundIcon, label: 'Teams', to: paths.dashboard.teams.path },
  {
    icon: FolderCodeIcon,
    label: 'Projects',
    to: paths.dashboard.projects.path,
  },
];

export const DashboardNavigation = () => {
  const { pathname } = useLocation();

  return (
    <div className={styles.section}>
      <div className={styles.mainLinks}>
        {links.map((link) => (
          <NavLink
            active={link.to.startsWith(pathname)}
            className={styles.mainLink}
            component={Link}
            label={link.label}
            leftSection={<link.icon size={16} />}
            to={link.to}
          />
        ))}
      </div>
    </div>
  );
};
