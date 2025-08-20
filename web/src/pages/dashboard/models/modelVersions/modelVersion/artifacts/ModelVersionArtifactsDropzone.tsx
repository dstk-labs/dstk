import { useMutation } from '@apollo/client';
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Text,
} from '@mantine/core';
import { Dropzone, type FileWithPath } from '@mantine/dropzone';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { FileIcon, TrashIcon } from 'lucide-react';
import { useRef, useState } from 'react';

import { Modal } from '@/components/modal/Modal';
import { gql } from '@/graphql';
import { CompletedPartInput } from '@/graphql/types';

const PART_SIZE = 5 * 1024 * 1024; // 5MB chunks

const PRESIGN_URL = gql(`
  mutation PresignURL($data: PresignedURLInput!) {
    presignURL(data: $data) {
      ETag
      key
      partNumber
      uploadId
      url
    }
  }
`);

type ModelVersionArtifactsDropzoneProps = {
  modelVersionId: string;
};

// TODO: Abort
export const ModelVersionArtifactsDropzone = ({
  modelVersionId,
}: ModelVersionArtifactsDropzoneProps) => {
  const openRef = useRef<() => void>(null);

  const [opened, { close, open }] = useDisclosure(false);
  const [files, setFiles] = useState<FileWithPath[]>([]);

  const [presignURL, { loading }] = useMutation(PRESIGN_URL);

  async function createMultipartUpload(filename: string) {
    const { data } = await presignURL({
      variables: {
        data: {
          filename,
          method: 'createMultipartUpload',
          modelVersionId,
        },
      },
    });
    return data?.presignURL;
  }

  async function getPresignedPartUrl(
    uploadId: string,
    key: string,
    partNumber: number,
  ) {
    const { data } = await presignURL({
      variables: {
        data: {
          filename: key.split('/').pop(),
          method: 'uploadPart',
          modelVersionId,
          partNumber,
          uploadId,
        },
      },
    });
    return data?.presignURL?.url;
  }

  async function finalizeMultipartUpload(
    uploadId: string,
    key: string,
    parts: CompletedPartInput[],
  ) {
    const { data } = await presignURL({
      refetchQueries: ['ListObjectsForModelVersion'],
      variables: {
        data: {
          filename: key.split('/').pop(),
          method: 'finalizeMultipartUpload',
          modelVersionId,
          multipartUpload: {
            Parts: parts.sort((a, b) => a.PartNumber - b.PartNumber),
          },
          uploadId,
        },
      },
    });
    return data?.presignURL;
  }

  async function uploadFile(file: File) {
    const createMultipartUploadResult = await createMultipartUpload(file.name);

    const partsCount = Math.ceil(file.size / PART_SIZE);
    const uploadedParts = [];

    // TODO: Parallel
    for (let partNumber = 1; partNumber <= partsCount; partNumber++) {
      const start = (partNumber - 1) * PART_SIZE;
      const end = Math.min(start + PART_SIZE, file.size);
      const blob = file.slice(start, end);

      const url = await getPresignedPartUrl(
        createMultipartUploadResult?.uploadId ?? '',
        createMultipartUploadResult?.key ?? '',
        partNumber,
      );

      // TODO: Progress bar
      const presignURLResult = await fetch(url ?? '', {
        body: blob,
        method: 'PUT',
      });
      if (!presignURLResult.ok) {
        throw new Error(`Part ${partNumber} upload failed`);
      }

      presignURLResult.headers.forEach((header) => console.log(header));

      uploadedParts.push({
        ETag: presignURLResult.headers.get('ETag') ?? '',
        PartNumber: partNumber,
      });
    }

    await finalizeMultipartUpload(
      createMultipartUploadResult?.uploadId ?? '',
      createMultipartUploadResult?.key ?? '',
      uploadedParts,
    );
  }

  const uploadAllFiles = async () => {
    await Promise.all(files.map((file) => uploadFile(file)));
    close();
    notifications.show({
      message: `Successfully uploaded ${files.length} files`,
      title: 'Success',
    });
    setFiles([]);
  };

  const filePreviews = files.map((file) => {
    return (
      <Paper p='md' radius='md' shadow='xs' withBorder>
        <Group align='center' justify='space-between'>
          <Group gap='sm' style={{ flex: 1 }}>
            {/* TODO: Change Icon based on file type */}
            <FileIcon color='gray' size={24} />
            <div>
              <Text fw={500} lineClamp={1} size='sm'>
                {file.name}
              </Text>
              <Text c='dimmed' size='xs'>
                {file.size} bytes
              </Text>
            </div>
          </Group>

          <ActionIcon
            color='gray'
            onClick={() => {
              setFiles((prevState) =>
                prevState.filter((prevState) => prevState.path !== file.path),
              );
            }}
            variant='subtle'
          >
            <TrashIcon size={16} />
          </ActionIcon>
        </Group>
      </Paper>
    );
  });

  return (
    <>
      <Modal
        disabled={loading}
        onClose={close}
        opened={opened}
        size='lg'
        title='Add Files'
      >
        <Dropzone
          multiple
          onDrop={setFiles}
          onReject={(files) => console.log('rejected files', files)}
          openRef={openRef}
        >
          <Group
            gap='xl'
            justify='center'
            mih={110}
            style={{ pointerEvents: 'none' }}
          >
            <div>
              <Text inline size='md'>
                Drag objects here or click to select files
              </Text>
              <Text c='dimmed' inline mt={7} size='sm'>
                We should probably only allow certain mime types
              </Text>
            </div>
          </Group>
        </Dropzone>
        <SimpleGrid mt={filePreviews.length > 0 ? 'sm' : 0} w='100%'>
          {filePreviews}
        </SimpleGrid>
        <Flex align='center' justify='end' mt='xl'>
          <Button
            color='blue'
            disabled={filePreviews.length === 0}
            loading={loading}
            onClick={() => uploadAllFiles()}
            radius='md'
            type='submit'
          >
            Submit
          </Button>
        </Flex>
      </Modal>
      <Button
        onClick={() => {
          openRef.current?.();
          open();
        }}
      >
        Add Files
      </Button>
    </>
  );
};
