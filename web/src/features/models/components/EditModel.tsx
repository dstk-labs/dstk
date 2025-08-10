import { useMutation } from '@apollo/client';
import { Button, Flex, Group, Stack, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { cloneElement } from 'react';
import { useNavigate } from 'react-router';
import { z } from 'zod/v4';

import type { EditModelMutationVariables } from '@/graphql/types';

import { Modal } from '@/components/modal/Modal';
import { GET_ML_MODEL } from '@/features/models/loaders/modelLoader';
import { ProjectsSelect } from '@/features/projects/components/ProjectsSelect';
import { StorageProviderSelect } from '@/features/storage/components/StorageProviderSelect';
import { gql } from '@/graphql';
import { apolloClient } from '@/lib/apollo';

import { LIST_MODELS } from '../loaders/modelsLoader';

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
  trigger: React.ReactElement<{ disabled?: boolean; onClick?: () => void }>;
};

type EditModelSchema = z.infer<typeof editModelSchema>;

export const EditModel = ({
  isArchived,
  modelId,
  originalDescription,
  originalModelName,
  originalProjectId,
  originalStorageProviderId,
  trigger,
}: EditModelProps) => {
  const navigate = useNavigate();

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
      onCompleted: async (data) => {
        editModelForm.reset();
        notifications.show({
          message: `Successfully edited ${data.editModel?.modelName}`,
          title: 'Success',
        });
        close();

        // Need to force reload so the breadcrumb value updates appropriately.
        // TODO: Investigate using the breadcrumbs in a react context (always get data from loader)
        // 🔥 Force reload of route to trigger crumb update

        // We have to refetch the queries here, so the navigation happens AFTER
        // the refetch
        await apolloClient.refetchQueries({
          include: [LIST_MODELS, GET_ML_MODEL],
        });
        navigate(location.pathname, { replace: true });
      },
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
      {cloneElement(trigger, {
        disabled: isArchived || trigger.props.disabled,
        onClick: open,
      })}
    </>
  );
};
