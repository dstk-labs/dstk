import { gql, useMutation } from "@apollo/client";
import {
  Avatar,
  Badge,
  Group,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  ActivityIcon,
  BellIcon,
  ChevronRightIcon,
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  UserRoundIcon,
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router";

import { paths } from "@/config/paths";
import { useUser } from "@/features/auth/hooks/authHooks";
import { GET_USER } from "@/features/auth/loaders/authLoader";

import classes from "./UserButton.module.css";

const LOGOUT = gql(`
  mutation Logout {
    logout
  }
`);

type UserButtonProps = {
  setIsLoading: (value: boolean) => void;
};

export function UserButton({ setIsLoading }: UserButtonProps) {
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
                <Text fw={500} size="sm">
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
            rightSection={(
              <Badge circle color="red" size="xs">
                5
              </Badge>
            )}
          >
            Notifications
          </Menu.Item>
          <Menu.Item
            leftSection={<ActivityIcon size={14} />}
            rightSection={(
              <Badge circle color="red" size="xs">
                2
              </Badge>
            )}
          >
            Activity
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item
            leftSection={<LogOutIcon size={14} />}
            onClick={() => logout({ refetchQueries: [{ query: GET_USER }] })}
          >
            Log out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  }
}
