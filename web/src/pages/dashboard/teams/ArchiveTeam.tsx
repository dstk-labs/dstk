import { useMutation } from '@apollo/client';
import {
  ActionIcon,
  Button,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { ArchiveIcon } from 'lucide-react';
import { useState } from 'react';

import { Modal } from '@/components/modal/Modal';
import { gql } from '@/graphql';

const ARCHIVE_TEAM = gql(`
  mutation ArchiveTeam($teamId: String!) {
    archiveTeam(teamId: $teamId) {
      name
    }
  }
`);

type ArchiveTeamProps = {
  isArchived: boolean;
  teamId: string;
  teamName: string;
};

export const ArchiveTeam = ({
  isArchived,
  teamId,
  teamName,
}: ArchiveTeamProps) => {
  const [inputValue, setInputValue] = useState('');

  const [archiveTeam, { loading }] = useMutation(ARCHIVE_TEAM);

  const [opened, { close, open }] = useDisclosure(false);

  const onSubmit = () =>
    archiveTeam({
      onCompleted: (data) => {
        notifications.show({
          message: `Successfully archived ${data.archiveTeam?.name}`,
          title: 'Success',
        });
        close();
        setInputValue('');
      },
      refetchQueries: ['ListTeamsForDropdown', 'ListTeamsForTable'],
      variables: {
        teamId,
      },
    });

  return (
    <>
      <Modal
        disabled={loading}
        onClose={close}
        opened={opened}
        size='lg'
        title={`Archive ${teamName}`}
      >
        <Stack gap='md'>
          <Text size='sm'>
            This action is{' '}
            <Text c='red' fw={500} span>
              irreversible
            </Text>
            . Archiving this team will permanently prevent any further
            modifications or the addition of new resources.
          </Text>
          <TextInput
            label='Please type in the name of the team to continue'
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={teamName}
            value={inputValue}
          />
          <Button
            color='red'
            disabled={inputValue !== teamName || loading}
            fullWidth
            loading={loading}
            mt='sm'
            onClick={() => onSubmit()}
            radius='md'
          >
            I understand, archive this team
          </Button>
        </Stack>
      </Modal>

      <Tooltip disabled={isArchived} label='Archive'>
        <ActionIcon
          color='red'
          disabled={isArchived}
          onClick={open}
          variant='subtle'
        >
          <ArchiveIcon size={14} />
        </ActionIcon>
      </Tooltip>
    </>
  );
};
