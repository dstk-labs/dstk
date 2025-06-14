import {
  ActionIcon,
  Group,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import cx from 'clsx';
import { BookIcon, SearchIcon } from 'lucide-react';

import { DiscordIcon } from '@/components/icons/discord/DiscordIcon';
import { GithubIcon } from '@/components/icons/github/GithubIcon';

import styles from './DashboardToolbar.module.css';

export const DashboardToolbar = () => (
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
    </Group>
  </Tooltip.Group>
);
