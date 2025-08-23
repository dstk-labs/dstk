import { useMutation } from '@apollo/client';
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Paper,
  Progress,
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

const PART_SIZE = 5 * 1024 * 1024; // 5 MB

type FileProgress = {
  progress: number;
  status: FileUploadStatus;
};

type FileUploadStatus = 'error' | 'pending' | 'success' | 'uploading';

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

export const ModelVersionArtifactsDropzone = ({
  modelVersionId,
}: ModelVersionArtifactsDropzoneProps) => {
  const openRef = useRef<() => void>(null);

  const [uploading, setUploading] = useState(false);
  const [opened, { close, open }] = useDisclosure(false);

  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [fileProgress, setFileProgress] = useState<
    Record<string, FileProgress>
  >({});

  const [presignURL] = useMutation(PRESIGN_URL);

  async function abortMultipartUpload(filename: string, uploadId: string) {
    await presignURL({
      variables: {
        data: {
          filename,
          method: 'abortMultipartUpload',
          modelVersionId,
          uploadId,
        },
      },
    });
  }

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

  async function uploadPart(
    file: File,
    uploadId: string,
    key: string,
    partNumber: number,
  ) {
    const start = (partNumber - 1) * PART_SIZE;
    const end = Math.min(start + PART_SIZE, file.size);
    const blob = file.slice(start, end);

    const url = await getPresignedPartUrl(uploadId, key, partNumber);

    const res = await fetch(url ?? '', { body: blob, method: 'PUT' });
    if (!res.ok) throw new Error(`Part ${partNumber} upload failed`);

    return { ETag: res.headers.get('ETag'), PartNumber: partNumber };
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
    let uploadId = '';

    setFileProgress((prev) => ({
      ...prev,
      [file.name]: { progress: 0, status: 'uploading' },
    }));

    try {
      const createMultipartUploadResult = await createMultipartUpload(
        file.name,
      );
      uploadId = createMultipartUploadResult?.uploadId ?? '';

      const partsCount = Math.ceil(file.size / PART_SIZE);
      const partNumbers = Array.from(
        { length: partsCount },
        (_, idx) => idx + 1,
      );

      const uploadedPartsResults = await Promise.allSettled(
        partNumbers.map(async (partNumber) => {
          const result = await uploadPart(
            file,
            createMultipartUploadResult?.uploadId ?? '',
            createMultipartUploadResult?.key ?? '',
            partNumber,
          );

          setFileProgress((prev) => {
            const done = (prev[file.name]?.progress ?? 0) + 100 / partsCount;
            return {
              ...prev,
              [file.name]: {
                progress: Math.min(done, 100),
                status: 'uploading',
              },
            };
          });

          return { ETag: result.ETag ?? '', PartNumber: result.PartNumber };
        }),
      );

      const uploadedParts = uploadedPartsResults
        .filter(
          (
            result,
          ): result is PromiseFulfilledResult<{
            ETag: string;
            PartNumber: number;
          }> => result.status === 'fulfilled',
        )
        .map((r) => r.value);

      if (uploadedParts.length !== partsCount) {
        throw new Error('Some parts failed');
      }

      await finalizeMultipartUpload(
        createMultipartUploadResult?.uploadId ?? '',
        createMultipartUploadResult?.key ?? '',
        uploadedParts,
      );

      setFileProgress((prev) => ({
        ...prev,
        [file.name]: { progress: 100, status: 'success' },
      }));
    } catch {
      if (uploadId) {
        await abortMultipartUpload(file.name, uploadId);
      }
      setFileProgress((prev) => ({
        ...prev,
        [file.name]: {
          progress: prev[file.name]?.progress ?? 0,
          status: 'error',
        },
      }));
      notifications.show({
        color: 'red',
        message: `Upload failed for ${file.name}`,
      });
    }
  }

  const uploadAllFiles = async () => {
    setUploading(true);

    await Promise.allSettled(files.map((file) => uploadFile(file)));

    setUploading(false);

    const hasErrors = Object.values(fileProgress).some(
      (file) => file.status === 'error',
    );
    const hasSuccess = Object.values(fileProgress).some(
      (file) => file.status === 'success',
    );

    if (!hasErrors) {
      close();
      notifications.show({
        message: `Successfully uploaded ${files.length} file${files.length > 1 ? 's' : ''}`,
        title: 'Success',
      });
      setFiles([]);
      setFileProgress({});
    } else {
      const message = hasSuccess
        ? 'Some files uploaded successfully, but others failed.'
        : 'All file uploads failed.';

      notifications.show({
        color: 'red',
        message,
        title: 'Upload Issues',
      });
    }
  };

  const retryFailedFiles = async () => {
    setUploading(true);

    await Promise.allSettled(
      files
        .filter((file) => fileProgress[file.name]?.status === 'error')
        .map((file) => uploadFile(file)),
    );

    setUploading(false);

    const hasErrors = Object.values(fileProgress).some(
      (f) => f.status === 'error',
    );

    if (!hasErrors) {
      close();
      notifications.show({
        message: 'All failed files uploaded successfully',
        title: 'Success',
      });
      setFiles([]);
      setFileProgress({});
    } else {
      const failedFiles = files.filter(
        (file) => fileProgress[file.name]?.status === 'error',
      );
      setFiles(failedFiles);

      notifications.show({
        color: 'red',
        message: `Some files are still failing (${failedFiles.length}).`,
      });
    }
  };

  const filePreviews = files.map((file) => {
    const progress = fileProgress[file.name]?.progress ?? 0;
    const status = fileProgress[file.name]?.status ?? 'pending';

    return (
      <Paper p='md' radius='md' shadow='xs' withBorder>
        <Group align='center' justify='space-between'>
          <Group gap='sm' style={{ flex: 1 }}>
            {/* TODO: Change Icon based on file type? */}
            <FileIcon color='gray' size={24} />
            <div>
              <Text fw={500} lineClamp={1} size='sm'>
                {file.name}
              </Text>
              <Text c='dimmed' size='xs'>
                {file.size} bytes
              </Text>
            </div>
            {uploading && (
              <Progress
                animated={status === 'uploading'}
                color={
                  status === 'error'
                    ? 'red'
                    : status === 'success'
                      ? 'green'
                      : 'blue'
                }
                value={progress}
                w='100%'
              />
            )}
          </Group>
          <ActionIcon
            color='gray'
            disabled={uploading}
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
        disabled={uploading}
        onClose={close}
        opened={opened}
        size='lg'
        title='Add Files'
      >
        <Dropzone
          loading={uploading}
          multiple
          onDrop={setFiles}
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
                We should probably only allow certain mime types.
              </Text>
            </div>
          </Group>
        </Dropzone>
        <SimpleGrid mt={filePreviews.length > 0 ? 'sm' : 0} w='100%'>
          {filePreviews}
        </SimpleGrid>
        <Flex align='center' justify='end' mt='xl'>
          {files.some((file) => fileProgress[file.name]?.status === 'error') ? (
            <Button
              color='red'
              loading={uploading}
              onClick={retryFailedFiles}
              radius='md'
            >
              Retry Failed Files
            </Button>
          ) : (
            <Button
              color='blue'
              disabled={filePreviews.length === 0}
              loading={uploading}
              onClick={uploadAllFiles}
              radius='md'
              type='submit'
            >
              Submit
            </Button>
          )}
        </Flex>
      </Modal>
      <Button onClick={open}>Add Files</Button>
    </>
  );
};
