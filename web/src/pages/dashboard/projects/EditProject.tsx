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

import type { EditProjectMutationVariables } from '@/graphql/types';

import { Modal } from '@/components/modal/Modal';
import { gql } from '@/graphql';

const EDIT_PROJECT = gql(`
  mutation EditProject($data: EditProjectInput!) {
    editProject(data: $data) {
        name
    }
  }
`);

const editProjectSchema = z.object({
  description: z.string().min(1, 'Required'),
  name: z.string().min(1, 'Required'),
}) satisfies z.ZodType<Omit<EditProjectMutationVariables['data'], 'projectId'>>;

type EditProjectProps = {
  isArchived: boolean;
  originalDescription: string;
  originalName: string;
  projectId: string;
};

type EditProjectSchema = z.infer<typeof editProjectSchema>;

export const EditProject = ({
  isArchived,
  originalDescription,
  originalName,
  projectId,
}: EditProjectProps) => {
  const [createProject, { loading }] = useMutation(EDIT_PROJECT);

  const [opened, { close, open }] = useDisclosure(false);

  const editProjectForm = useForm({
    initialValues: {
      description: originalDescription,
      name: originalName,
    },
    mode: 'uncontrolled',
    validate: zod4Resolver(editProjectSchema),
  });

  const onSubmit = (values: EditProjectSchema) =>
    createProject({
      onCompleted: (data) => {
        notifications.show({
          message: `Successfully edited ${data.editProject?.name}`,
          title: 'Success',
        });
        close();
      },
      refetchQueries: ['ListProjectsForTable', 'ListProjectsForSelect'],
      variables: {
        data: {
          description: values.description,
          name: values.name,
          projectId,
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
        <form onSubmit={editProjectForm.onSubmit((values) => onSubmit(values))}>
          <Stack gap='md'>
            <TextInput
              disabled={loading}
              key={editProjectForm.key('name')}
              label='Project Name'
              withAsterisk
              {...editProjectForm.getInputProps('name')}
            />

            <Textarea
              disabled={loading}
              key={editProjectForm.key('description')}
              label='Description'
              withAsterisk
              {...editProjectForm.getInputProps('description')}
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
