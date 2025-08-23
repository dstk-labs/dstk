import { type FileWithPath } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { useCallback, useState } from 'react';

import { FILE_UPLOAD_STATUS, PART_SIZE } from '../constants';
import { FileProgress, FileUploadState } from '../types';
import { useMultipartUpload } from './useMultipartUpload';

export const useFileUpload = (modelVersionId: string) => {
  const [state, setState] = useState<FileUploadState>({
    fileProgress: {},
    files: [],
    uploading: false,
  });

  const {
    abortMultipartUpload,
    createMultipartUpload,
    finalizeMultipartUpload,
    uploadPart,
  } = useMultipartUpload(modelVersionId);

  const updateFileProgress = useCallback(
    (
      fileName: string,
      update: ((prev: FileProgress) => FileProgress) | Partial<FileProgress>,
    ) => {
      setState((prev) => ({
        ...prev,
        fileProgress: {
          ...prev.fileProgress,
          [fileName]:
            typeof update === 'function'
              ? update(
                  prev.fileProgress[fileName] || {
                    progress: 0,
                    status: FILE_UPLOAD_STATUS.PENDING,
                  },
                )
              : { ...prev.fileProgress[fileName], ...update },
        },
      }));
    },
    [],
  );

  async function retryPart<T>(
    fn: () => Promise<T>,
    retries = 3,
    delayMs = 1000,
  ): Promise<T> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        if (attempt < retries) {
          await new Promise((res) => setTimeout(res, delayMs * attempt));
        }
      }
    }
    throw lastError;
  }

  const uploadFile = useCallback(
    async (file: File) => {
      let uploadId = '';

      updateFileProgress(file.name, {
        progress: 0,
        status: FILE_UPLOAD_STATUS.UPLOADING,
      });

      try {
        const createResult = await createMultipartUpload(file.name);
        if (!createResult?.uploadId || !createResult?.key) {
          throw new Error('Failed to create multipart upload');
        }

        uploadId = createResult.uploadId;
        const partsCount = Math.ceil(file.size / PART_SIZE);

        const uploadPromises = Array.from(
          { length: partsCount },
          (_, idx) => idx + 1,
        ).map(async (partNumber) => {
          // const result = await uploadPart(
          //   file,
          //   uploadId,
          //   createResult.key ?? '',
          //   partNumber,
          // );
          const result = await retryPart(
            () =>
              uploadPart(
                file,
                uploadId ?? '',
                createResult.key ?? '',
                partNumber,
              ),
            3, // retry up to 3 times
            1000, // 1s, 2s, 3s backoff
          );

          updateFileProgress(file.name, (prev) => ({
            progress: Math.min(prev.progress + 100 / partsCount, 100),
            status: FILE_UPLOAD_STATUS.UPLOADING,
          }));

          return result;
        });

        const uploadedPartsResults = await Promise.allSettled(uploadPromises);

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
          throw new Error('Some parts failed to upload');
        }

        await finalizeMultipartUpload(
          uploadId,
          createResult.key,
          uploadedParts,
        );
        updateFileProgress(file.name, {
          progress: 100,
          status: FILE_UPLOAD_STATUS.SUCCESS,
        });
      } catch (error) {
        if (uploadId) {
          await abortMultipartUpload(file.name, uploadId);
        }

        updateFileProgress(file.name, (prev) => ({
          progress: prev.progress,
          status: FILE_UPLOAD_STATUS.ERROR,
        }));

        notifications.show({
          color: 'red',
          message: `Upload failed for ${file.name}`,
        });

        throw error;
      }
    },
    [
      createMultipartUpload,
      uploadPart,
      finalizeMultipartUpload,
      abortMultipartUpload,
      updateFileProgress,
    ],
  );

  const uploadAllFiles = useCallback(
    async (files: FileWithPath[]) => {
      setState((prev) => ({ ...prev, uploading: true }));

      await Promise.allSettled(files.map((file) => uploadFile(file)));

      setState((prev) => ({ ...prev, uploading: false }));
    },
    [uploadFile],
  );

  const setFiles = useCallback((files: FileWithPath[]) => {
    setState((prev) => ({ ...prev, files }));
  }, []);

  const removeFile = useCallback((filePath: string) => {
    setState((prev) => ({
      ...prev,
      files: prev.files.filter((f) => f.path !== filePath),
    }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      fileProgress: {},
      files: [],
      uploading: false,
    });
  }, []);

  return {
    ...state,
    removeFile,
    resetState,
    setFiles,
    uploadAllFiles,
    uploadFile,
  };
};
