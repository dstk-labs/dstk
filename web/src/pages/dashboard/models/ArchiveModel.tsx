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

const ARCHIVE_MODEL = gql(`
  mutation ArchiveModel($modelId: String!) {
    archiveModel(modelId: $modelId) {
      modelName
    }
  }
`);

type ArchiveModelProps = {
  isArchived: boolean;
  modelId: string;
  modelName: string;
};

export const ArchiveModel = ({
  isArchived,
  modelId,
  modelName,
}: ArchiveModelProps) => {
  const [inputValue, setInputValue] = useState('');

  const [archiveModel, { loading }] = useMutation(ARCHIVE_MODEL);

  const [opened, { close, open }] = useDisclosure(false);

  const onSubmit = () =>
    archiveModel({
      onCompleted: (data) => {
        notifications.show({
          message: `Successfully archived ${data.archiveModel?.modelName}`,
          title: 'Success',
        });
        close();
        setInputValue('');
      },
      refetchQueries: ['ListMLModels'],
      variables: {
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
        title={`Archive ${modelName}`}
      >
        <Stack gap='md'>
          <Text size='sm'>
            This action is{' '}
            <Text c='red' fw={500} span>
              irreversible
            </Text>
            . Archiving this model will permanently prevent any further
            modifications and deployments.
          </Text>
          <TextInput
            label='Please type in the name of the model to continue'
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={modelName}
            value={inputValue}
          />
          <Button
            color='red'
            disabled={inputValue !== modelName || loading}
            fullWidth
            loading={loading}
            mt='sm'
            onClick={() => onSubmit()}
            radius='md'
          >
            I understand, archive this model
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
