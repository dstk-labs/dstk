import { Anchor } from '@/components/anchor/anchor';
import { ActionIcon, Breadcrumbs, Menu } from '@mantine/core';
import { ChevronRightIcon, EllipsisIcon } from 'lucide-react';
import { Link, useMatches, type UIMatch } from 'react-router';
import styles from './DashboardBreadcrumbs.module.css';

export const DashboardBreadcrumbs = () => {
  const matches = useMatches() as UIMatch<
    unknown, { crumb: (data?: unknown) => string }
  >[];

  const crumbs = matches
    .filter((match) => Boolean(match.handle))
    .map((match) => ({
      href: match.pathname,
      label: match.handle.crumb(),
    }));

  return (
    <>
      <Breadcrumbs visibleFrom='lg' separator={<ChevronRightIcon size={14} />}>
        {crumbs.map(crumb => (
          <Anchor to={crumb.href} key={crumb.href}>
            {crumb.label}
          </Anchor>
        ))}
      </Breadcrumbs>
      <Menu
        trigger="click-hover"
        loop={false}
        position='right-start'
        withinPortal={false}
        trapFocus={false}
        menuItemTabIndex={0}
      >
        <Menu.Target>
          <ActionIcon
            className={styles.trigger}
            hiddenFrom='lg'
            size='lg'
            variant='transparent'
          >
            <EllipsisIcon />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {crumbs.map(crumb => (
            <Menu.Item
              component={Link}
              fw='bold'
              to={crumb.href}
              key={crumb.href}
            >
              {crumb.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </>
  );
};
