import { useMutation } from '@apollo/client';
import {
  ActionIcon,
  Button,
  Flex,
  Group,
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

import type { EditModelMutationVariables } from '@/graphql/types';

import { Modal } from '@/components/modal/Modal';
import { ProjectsSelect } from '@/features/projects/components/ProjectsSelect';
import { StorageProviderSelect } from '@/features/storage/components/StorageProviderSelect';
import { gql } from '@/graphql';

const EDIT_MODEL = gql(`
  mutation EditModel($data: ModelInput!, $modelId: String!) {
    editModel(data: $data, modelId: $modelId) {
      modelName
  }
}
`);

const editModelSchema = z.object({
  description: z.string().min(1, 'Required'),
  modelName: z.string().min(1, 'Required'),
  projectId: z.string().min(1, 'Required'),
  storageProviderId: z.string().min(1, 'Required'),
}) satisfies z.ZodType<Omit<EditModelMutationVariables['data'], 'modelId'>>;

type EditModelProps = {
  isArchived: boolean;
  modelId: string;
  originalDescription: string;
  originalModelName: string;
  originalProjectId: string;
  originalStorageProviderId: string;
};

type EditModelSchema = z.infer<typeof editModelSchema>;

export const EditModel = ({
  isArchived,
  modelId,
  originalDescription,
  originalModelName,
  originalProjectId,
  originalStorageProviderId,
}: EditModelProps) => {
  const [editModel, { loading }] = useMutation(EDIT_MODEL);

  const [opened, { close, open }] = useDisclosure(false);

  const editModelForm = useForm({
    initialValues: {
      description: originalDescription,
      modelName: originalModelName,
      projectId: originalProjectId,
      storageProviderId: originalStorageProviderId,
    },
    mode: 'uncontrolled',
    validate: zod4Resolver(editModelSchema),
  });

  const onSubmit = (values: EditModelSchema) =>
    editModel({
      onCompleted: (data) => {
        editModelForm.reset();
        notifications.show({
          message: `Successfully edited ${data.editModel?.modelName}`,
          title: 'Success',
        });
        close();
      },
      refetchQueries: ['ListMLModels'],
      variables: {
        data: {
          description: values.description,
          modelName: values.modelName,
          projectId: values.projectId,
          storageProviderId: values.storageProviderId,
        },
        modelId,
      },
    });

  return (
    <>
      <Modal
        disabled={loading}
        onClose={close}
        opened={opened}
        size='lg'
        title={`Edit ${originalModelName}`}
      >
        <form onSubmit={editModelForm.onSubmit((values) => onSubmit(values))}>
          <Stack gap='md'>
            <TextInput
              disabled={loading}
              key={editModelForm.key('modelName')}
              label='Model Name'
              withAsterisk
              {...editModelForm.getInputProps('modelName')}
            />

            {/* TODO: Stack on sm */}
            <Group grow>
              <StorageProviderSelect
                disabled={loading}
                key={editModelForm.key('storageProviderId')}
                withAsterisk
                {...editModelForm.getInputProps('storageProviderId')}
              />
              <ProjectsSelect
                disabled={loading}
                key={editModelForm.key('projectId')}
                withAsterisk
                {...editModelForm.getInputProps('projectId')}
              />
            </Group>

            <Textarea
              disabled={loading}
              key={editModelForm.key('description')}
              label='Description'
              rows={4}
              withAsterisk
              {...editModelForm.getInputProps('description')}
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
