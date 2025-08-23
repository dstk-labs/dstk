import { useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { gql } from '@/graphql';
import { CompletedPartInput } from '@/graphql/types';

import { PART_SIZE } from '../constants';
import { MultipartUploadMethods } from '../types';

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

export const useMultipartUpload = (modelVersionId: string) => {
  const [presignURL] = useMutation(PRESIGN_URL);

  const executePresignedRequest = useCallback(
    async (
      filename: string | undefined,
      method: MultipartUploadMethods,
      options?: {
        partNumber?: number;
        parts?: CompletedPartInput[];
        refetchQueries?: string[];
        uploadId?: string;
      },
    ) => {
      const { data } = await presignURL({
        refetchQueries: options?.refetchQueries,
        variables: {
          data: {
            filename,
            method,
            modelVersionId,
            multipartUpload: options?.parts
              ? {
                  Parts: options.parts.sort(
                    (a, b) => a.PartNumber - b.PartNumber,
                  ),
                }
              : undefined,
            partNumber: options?.partNumber,
            uploadId: options?.uploadId,
          },
        },
      });
      return data?.presignURL;
    },
    [presignURL, modelVersionId],
  );

  const createMultipartUpload = useCallback(
    (filename: string) =>
      executePresignedRequest(filename, 'createMultipartUpload'),
    [executePresignedRequest],
  );

  const abortMultipartUpload = useCallback(
    (filename: string, uploadId: string) =>
      executePresignedRequest(filename, 'abortMultipartUpload', { uploadId }),
    [executePresignedRequest],
  );

  const getPresignedPartUrl = useCallback(
    async (uploadId: string, key: string, partNumber: number) => {
      const result = await executePresignedRequest(
        key.split('/').pop(),
        'uploadPart',
        { partNumber, uploadId },
      );
      return result?.url;
    },
    [executePresignedRequest],
  );

  const finalizeMultipartUpload = useCallback(
    (uploadId: string, key: string, parts: CompletedPartInput[]) =>
      executePresignedRequest(key.split('/').pop(), 'finalizeMultipartUpload', {
        parts,
        refetchQueries: ['ListObjectsForModelVersion'],
        uploadId,
      }),
    [executePresignedRequest],
  );

  const uploadPart = useCallback(
    async (file: File, uploadId: string, key: string, partNumber: number) => {
      const start = (partNumber - 1) * PART_SIZE;
      const end = Math.min(start + PART_SIZE, file.size);
      const blob = file.slice(start, end);

      const url = await getPresignedPartUrl(uploadId, key, partNumber);
      if (!url)
        throw new Error(`Failed to get presigned URL for part ${partNumber}`);

      const res = await fetch(url, { body: blob, method: 'PUT' });
      if (!res.ok) throw new Error(`Part ${partNumber} upload failed`);

      return {
        ETag: res.headers.get('ETag') ?? '',
        PartNumber: partNumber,
      };
    },
    [getPresignedPartUrl],
  );

  return {
    abortMultipartUpload,
    createMultipartUpload,
    finalizeMultipartUpload,
    uploadPart,
  };
};
