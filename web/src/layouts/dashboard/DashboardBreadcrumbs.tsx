import { ActionIcon, Breadcrumbs, Menu } from '@mantine/core';
import { ChevronRightIcon, EllipsisIcon } from 'lucide-react';
import { Link, type UIMatch, useMatches } from 'react-router';

import { Anchor } from '@/components/anchor/anchor';

import styles from './DashboardBreadcrumbs.module.css';

export const DashboardBreadcrumbs = () => {
  const matches = useMatches() as UIMatch<
    unknown,
    { crumb: (data?: unknown) => string }
  >[];

  const crumbs = matches
    .filter((match) => Boolean(match.handle))
    .map((match) => ({
      href: match.pathname,
      label: match.handle.crumb(),
    }));

  return (
    <>
      <Breadcrumbs separator={<ChevronRightIcon size={14} />} visibleFrom='lg'>
        {crumbs.map((crumb) => (
          <Anchor key={crumb.href} to={crumb.href}>
            {crumb.label}
          </Anchor>
        ))}
      </Breadcrumbs>
      <Menu
        loop={false}
        menuItemTabIndex={0}
        position='right-start'
        trapFocus={false}
        trigger='click-hover'
        withinPortal={false}
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
          {crumbs.map((crumb) => (
            <Menu.Item
              component={Link}
              fw='bold'
              key={crumb.href}
              to={crumb.href}
            >
              {crumb.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </>
  );
};
