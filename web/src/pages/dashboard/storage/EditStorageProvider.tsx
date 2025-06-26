import { useMutation } from '@apollo/client';
import {
  ActionIcon,
  Button,
  Flex,
  PasswordInput,
  Stack,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { EditIcon } from 'lucide-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { z } from 'zod/v4';

import type { EditStorageProviderMutationVariables } from '@/graphql/types';

import { Modal } from '@/components/modal/Modal';
import { gql } from '@/graphql';

const EDIT_STORAGE_PROVIDER = gql(`
  mutation EditStorageProvider($data: EditStorageProviderInput!) {
    editStorageProvider(data: $data) {
        bucket
    }
  }
`);

const editStorageProviderSchema = z.object({
  accessKeyId: z.string().min(1, 'Required'),
  secretAccessKey: z.string().min(1, 'Required'),
}) satisfies z.ZodType<
  Omit<EditStorageProviderMutationVariables['data'], 'providerId'>
>;

type EditStorageProviderProps = {
  bucket: string;
  isArchived: boolean;
  originalAccessKeyId: string;
  providerId: string;
};

type EditStorageProviderSchema = z.infer<typeof editStorageProviderSchema>;

export const EditStorageProvider = ({
  bucket,
  isArchived,
  originalAccessKeyId,
  providerId,
}: EditStorageProviderProps) => {
  const [editStorageProvider, { loading }] = useMutation(EDIT_STORAGE_PROVIDER);

  const [opened, { close, open }] = useDisclosure(false);

  const editProjectForm = useForm({
    initialValues: {
      accessKeyId: originalAccessKeyId,
      secretAccessKey: '',
    },
    mode: 'uncontrolled',
    validate: zod4Resolver(editStorageProviderSchema),
  });

  const onSubmit = (values: EditStorageProviderSchema) =>
    editStorageProvider({
      onCompleted: (data) => {
        notifications.show({
          message: `Successfully edited ${data.editStorageProvider?.bucket}`,
          title: 'Success',
        });
        close();
      },
      refetchQueries: [
        'ListStorageProvidersForTable',
        'ListStorageProvidersForSelect',
      ],
      variables: {
        data: {
          accessKeyId: values.accessKeyId,
          providerId,
          secretAccessKey: values.secretAccessKey,
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
        title={`Edit ${bucket}`}
      >
        <form onSubmit={editProjectForm.onSubmit((values) => onSubmit(values))}>
          <Stack gap='md'>
            <PasswordInput
              disabled={loading}
              key={editProjectForm.key('accessKeyId')}
              label='Access Key'
              withAsterisk
              {...editProjectForm.getInputProps('accessKeyId')}
            />

            <PasswordInput
              disabled={loading}
              key={editProjectForm.key('secretAccessKey')}
              label='Secret Access Key'
              withAsterisk
              {...editProjectForm.getInputProps('secretAccessKey')}
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
