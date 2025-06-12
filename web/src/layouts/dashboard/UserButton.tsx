import {
  Avatar,
  Badge,
  Group,
  Menu,
  Text,
  UnstyledButton
} from '@mantine/core';
import classes from './UserButton.module.css';
import { useUser } from '@/features/auth/hooks/authHooks';
import {
  ActivityIcon,
  BellIcon,
  ChevronRightIcon,
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  UserRoundIcon
} from 'lucide-react';
import { Link } from 'react-router';
import { paths } from '@/config/paths';
import { gql, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { GET_USER } from '@/features/auth/loaders/authLoader';

const LOGOUT = gql(`
  mutation Logout {
    logout
  }
`);

type UserButtonProps = {
  setIsLoading: (value: boolean) => void;
};

export const UserButton = ({ setIsLoading }: UserButtonProps) => {
  const { user } = useUser();

  const [logout, { loading }] = useMutation(LOGOUT);

  useEffect(() => {
    if (loading) {
      setIsLoading(false);
    }
  }, [loading, setIsLoading]);

  // TODO: Fix types on backend
  if (user?.realName && user.email) {
    return (
      <Menu closeOnItemClick={false} width={300} withArrow>
        <Menu.Target>
          <UnstyledButton className={classes.user}>
            <Group>
              <Avatar
                // TODO: Image
                color="initials"
                name={user.realName}
                radius="xl"
              />
              <div style={{ flex: 1 }}>
                <Text size="sm" fw={500}>
                  {user.userName}
                </Text>

                <Text c="dimmed" size="xs">
                  {user.email}
                </Text>
              </div>

              <ChevronRightIcon size={14} />
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown ml={-5}>
          <Menu.Item leftSection={<CreditCardIcon size={14} />}>
            Billing
          </Menu.Item>
          <Menu.Item
            component={Link}
            leftSection={<SettingsIcon size={14} />}
            to={paths.dashboard.settings.path}
          >
            Settings
          </Menu.Item>
          <Menu.Item leftSection={<UserRoundIcon size={14} />}>
            My Account
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item
            leftSection={<BellIcon size={14} />}
            rightSection={<Badge size="xs" color="red" circle>5</Badge>}
          >
            Notifications
          </Menu.Item>
          <Menu.Item
            leftSection={<ActivityIcon size={14} />}
            rightSection={<Badge size="xs" color="red" circle>2</Badge>}
          >
            Activity
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item
            leftSection={<LogOutIcon size={14} />}
            onClick={() => logout({ refetchQueries: [{ query: GET_USER }]})}
          >
            Log out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  }
};
