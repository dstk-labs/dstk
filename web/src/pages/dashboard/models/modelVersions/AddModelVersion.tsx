import { useMutation } from '@apollo/client';
import { Button, Flex, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { z } from 'zod/v4';

import { Modal } from '@/components/modal/Modal';
import { gql } from '@/graphql';
import { CreateModelVersionMutationVariables } from '@/graphql/types';

const CREATE_MODEL_VERSION = gql(`
  mutation CreateModelVersion($data: ModelVersionInput!) {
    createModelVersion(data: $data) {
      numericVersion
      modelId {
        modelName
      }
    }
  }
`);

const createModelVersionSchema = z.object({
  description: z.string().min(1, 'Required'),
}) satisfies z.ZodType<
  Omit<CreateModelVersionMutationVariables['data'], 'modelId'>
>;

type AddModelVersionProps = {
  disabled: boolean;
  modelId: string;
};

type CreateModelVersionSchema = z.infer<typeof createModelVersionSchema>;

export const AddModelVersion = ({
  disabled,
  modelId,
}: AddModelVersionProps) => {
  const [createModelVersion, { loading }] = useMutation(CREATE_MODEL_VERSION);

  const [opened, { close, open }] = useDisclosure(false);

  const createModelVersionForm = useForm({
    initialValues: {
      description: '',
    },
    mode: 'uncontrolled',
    validate: zod4Resolver(createModelVersionSchema),
  });

  const onSubmit = (values: CreateModelVersionSchema) => {
    createModelVersion({
      onCompleted: (data) => {
        notifications.show({
          message: `Successfully created version ${data.createModelVersion?.numericVersion} for model ${data.createModelVersion?.modelId?.modelName}`,
          title: 'Success',
        });
        createModelVersionForm.reset();
        close();
      },
      // TODO: Eventually GetModelVersionById
      refetchQueries: ['ListMLModels', 'ListMLModelVersions'],
      variables: {
        data: {
          description: values.description,
          modelId,
        },
      },
    });
  };

  return (
    <>
      <Modal
        disabled={loading}
        onClose={close}
        opened={opened}
        size='lg'
        title='Add Model Version'
      >
        <form
          onSubmit={createModelVersionForm.onSubmit((values) =>
            onSubmit(values),
          )}
        >
          <Textarea
            disabled={loading}
            key={createModelVersionForm.key('description')}
            label='Description'
            rows={4}
            withAsterisk
            {...createModelVersionForm.getInputProps('description')}
          />

          <Flex align='center' justify='end' mt='xl'>
            <Button color='blue' loading={loading} radius='md' type='submit'>
              Submit
            </Button>
          </Flex>
        </form>
      </Modal>

      <Button disabled={disabled} fullWidth onClick={open}>
        Add Model Version
      </Button>
    </>
  );
};
