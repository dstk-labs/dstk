import { useMutation } from '@apollo/client';
import { Button, Flex, Stack, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { z } from 'zod/v4';

import type { CreateProjectMutationVariables } from '@/graphql/types';

import { Modal } from '@/components/modal/Modal';
import { gql } from '@/graphql';
import { useTeamStore } from '@/stores/teamStore';

const CREATE_PROJECT = gql(`
  mutation CreateProject($data: ProjectInput!) {
    createProject(data: $data) {
      name
    }
  }
`);

const createProjectSchema = z.object({
  description: z.string().min(1, 'Required'),
  name: z.string().min(1, 'Required'),
}) satisfies z.ZodType<Omit<CreateProjectMutationVariables['data'], 'teamId'>>;

type CreateProjectSchema = z.infer<typeof createProjectSchema>;

export const AddProject = () => {
  const { selectedTeam } = useTeamStore();

  const [createProject, { loading }] = useMutation(CREATE_PROJECT);

  const [opened, { close, open }] = useDisclosure(false);

  const createProjectForm = useForm({
    initialValues: {
      description: '',
      name: '',
    },
    mode: 'uncontrolled',
    validate: zod4Resolver(createProjectSchema),
  });

  const onSubmit = (values: CreateProjectSchema) =>
    createProject({
      onCompleted: (data) => {
        notifications.show({
          message: `Successfully created ${data.createProject?.name}`,
          title: 'Success',
        });
        close();
      },
      refetchQueries: ['ListProjectsForTable', 'ListProjectsForSelect'],
      variables: {
        data: {
          description: values.description,
          name: values.name,
          teamId: selectedTeam!,
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
        title='Add Project'
      >
        <form
          onSubmit={createProjectForm.onSubmit((values) => onSubmit(values))}
        >
          <Stack gap='md'>
            <TextInput
              disabled={loading}
              key={createProjectForm.key('name')}
              label='Project Name'
              withAsterisk
              {...createProjectForm.getInputProps('name')}
            />

            <Textarea
              disabled={loading}
              key={createProjectForm.key('description')}
              label='Description'
              withAsterisk
              {...createProjectForm.getInputProps('description')}
            />
          </Stack>

          <Flex align='center' justify='end' mt='xl'>
            <Button color='blue' loading={loading} radius='md' type='submit'>
              Submit
            </Button>
          </Flex>
        </form>
      </Modal>

      <Button fullWidth onClick={open}>
        Add Project
      </Button>
    </>
  );
};
