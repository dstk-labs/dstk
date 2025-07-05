import { useMutation } from '@apollo/client';
import {
  ActionIcon,
  Button,
  Flex,
  Stack,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { EditIcon } from 'lucide-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { z } from 'zod/v4';

import type { EditTeamMutationVariables } from '@/graphql/types';

import { Modal } from '@/components/modal/Modal';
import { gql } from '@/graphql';

const EDIT_TEAM = gql(`
  mutation EditTeam($data: EditTeamInput!) {
    editTeam(data: $data) {
      name
    }
  }
`);

const editTeamSchema = z.object({
  description: z.string().min(1, 'Required'),
  name: z.string().min(1, 'Required'),
}) satisfies z.ZodType<Omit<EditTeamMutationVariables['data'], 'teamId'>>;

type EditTeamInputProps = {
  isArchived: boolean;
  originalDescription: string;
  originalName: string;
  teamId: string;
};

type EditTeamSchema = z.infer<typeof editTeamSchema>;

export const EditTeam = ({
  isArchived,
  originalDescription,
  originalName,
  teamId,
}: EditTeamInputProps) => {
  const [editTeam, { loading }] = useMutation(EDIT_TEAM);

  const [opened, { close, open }] = useDisclosure(false);

  const editTeamForm = useForm({
    initialValues: {
      description: originalDescription,
      name: originalName,
    },
    mode: 'uncontrolled',
    validate: zod4Resolver(editTeamSchema),
  });

  const onSubmit = (values: EditTeamSchema) =>
    editTeam({
      onCompleted: (data) => {
        notifications.show({
          message: `Successfully edited ${data.editTeam?.name}`,
          title: 'Success',
        });
        close();
      },
      refetchQueries: ['ListTeamsForDropdown', 'ListTeamsForTable'],
      variables: {
        data: {
          description: values.description,
          name: values.name,
          teamId,
        },
      },
    });

  return (
    <>
      <Modal
        disabled={loading}
        onClose={close}
        opened={opened}
        size='lg'
        title={`Edit ${originalName}`}
      >
        <form onSubmit={editTeamForm.onSubmit((values) => onSubmit(values))}>
          <Stack gap='md'>
            <TextInput
              disabled={loading}
              key={editTeamForm.key('name')}
              label='Team Name'
              withAsterisk
              {...editTeamForm.getInputProps('name')}
            />

            <Textarea
              disabled={loading}
              key={editTeamForm.key('description')}
              label='Description'
              withAsterisk
              {...editTeamForm.getInputProps('description')}
            />
          </Stack>

          <Flex align='center' justify='end' mt='xl'>
            <Button color='blue' loading={loading} radius='md' type='submit'>
              Submit
            </Button>
          </Flex>
        </form>
      </Modal>

      <Tooltip disabled={isArchived} label='Edit'>
        <ActionIcon
          color='blue'
          disabled={isArchived}
          onClick={open}
          variant='subtle'
        >
          <EditIcon size={14} />
        </ActionIcon>
      </Tooltip>
    </>
  );
};
