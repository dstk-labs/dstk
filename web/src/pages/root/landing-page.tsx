import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';

export const LandingPage = () => (
  <Button
    onClick={() =>
      notifications.show({
        title: 'Default notification',
        message: 'Do not forget to star DSTK on GitHub! 🌟',
      })
    }
  >
    Show notification
  </Button>
);
