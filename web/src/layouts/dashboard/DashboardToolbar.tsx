import {
  ActionIcon,
  Group,
  Text,
  Tooltip,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import cx from 'clsx';
import { BookIcon, MoonIcon, SearchIcon, SunIcon } from 'lucide-react';

import { DiscordIcon } from '@/components/icons/discord/DiscordIcon';
import { GithubIcon } from '@/components/icons/github/githubIcon';

import styles from './DashboardToolbar.module.css';

export const DashboardToolbar = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  });

  return (
    <Tooltip.Group closeDelay={100} openDelay={600}>
      <Group gap='xs'>
        <ActionIcon hiddenFrom='md' radius='md' size='lg' variant='default'>
          <SearchIcon size={20} />
        </ActionIcon>
        <UnstyledButton className={styles.search} visibleFrom='md'>
          <Group gap='xs'>
            <SearchIcon size={16} />
            <Text c='dimmed' fz='sm' pr={80}>
              Search
            </Text>
            <Text className={styles.shortcut} fw={700}>
              Ctrl + K
            </Text>
          </Group>
        </UnstyledButton>
        <Tooltip label='Discord'>
          <UnstyledButton className={cx(styles.control, styles.discord)}>
            <DiscordIcon height={20} width={20} />
          </UnstyledButton>
        </Tooltip>
        <Tooltip label='Source Code'>
          <ActionIcon radius='md' size='lg' variant='default'>
            <GithubIcon height={20} width={20} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label='Docs'>
          <ActionIcon radius='md' size='lg' variant='default'>
            <BookIcon size={20} />
          </ActionIcon>
        </Tooltip>
        <Tooltip
          aria-label='Toggle color scheme'
          label={`${computedColorScheme === 'dark' ? 'Light' : 'Dark'} mode`}
          onClick={() => {
            setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light');
          }}
        >
          <ActionIcon radius='md' size='lg' variant='default'>
            <SunIcon className={styles.light} size={20} />
            <MoonIcon className={styles.dark} size={20} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Tooltip.Group>
  );
};
