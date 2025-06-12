import {
  ActionIcon,
  Group,
  Text,
  Tooltip,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme
} from '@mantine/core';
import { BookIcon, MoonIcon, SearchIcon, SunIcon } from 'lucide-react';
import cx from 'clsx';
import styles from './DashboardToolbar.module.css';
import { GithubIcon } from '@/components/icons/github/githubIcon';
import { DiscordIcon } from '@/components/icons/discord/DiscordIcon';

export const DashboardToolbar = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme
    = useComputedColorScheme('light', { getInitialValueInEffect: true });
  
  
      
  return (
    <Tooltip.Group openDelay={600} closeDelay={100}>
      <Group gap="xs">
        <ActionIcon hiddenFrom='md' radius='md' variant='default' size='lg'>
          <SearchIcon size={20} />
        </ActionIcon>
        <UnstyledButton className={styles.search} visibleFrom='md'>
          <Group gap="xs">
            <SearchIcon size={16} />
            <Text fz="sm" c="dimmed" pr={80}>
              Search
            </Text>
            <Text fw={700} className={styles.shortcut}>
              Ctrl + K
            </Text>
          </Group>
        </UnstyledButton>
        <Tooltip label='Discord'>
          <UnstyledButton
            className={cx(styles.control, styles.discord)}
          >
            <DiscordIcon height={20} width={20} />
          </UnstyledButton>
        </Tooltip>
        <Tooltip label='Source Code'>
          <ActionIcon radius='md' variant='default' size='lg'>
            <GithubIcon height={20} width={20} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label='Docs'>
          <ActionIcon radius='md' variant='default' size='lg'>
            <BookIcon size={20} />
          </ActionIcon>
        </Tooltip>
        <Tooltip
          aria-label="Toggle color scheme"
          label={`${computedColorScheme === 'dark' ? 'Light' : 'Dark'} mode`}
          onClick={() => {
            setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light');
          }}
        >
          <ActionIcon radius='md' variant='default' size='lg'>
            <SunIcon className={styles.light} size={20} />
            <MoonIcon className={styles.dark} size={20} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Tooltip.Group>
  );
};
