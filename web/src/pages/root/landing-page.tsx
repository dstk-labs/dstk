import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';

export const LandingPage = () => (
  <Button
    onClick={() =>
      notifications.show({
        message: 'Do not forget to star DSTK on GitHub! 🌟',
        title: 'Default notification',
      })
    }
  >
    Show notification
  </Button>
);
