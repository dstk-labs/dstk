import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useCallback, useRef } from 'react';

import { FileUploadModal } from '@/features/modelVersions/components/FileUploadModal';
import { FILE_UPLOAD_STATUS } from '@/features/modelVersions/constants';
import { useFileUpload } from '@/features/modelVersions/hooks/useFileUpload';

type ModelVersionArtifactsDropzoneProps = {
  modelVersionId: string;
};

export const ModelVersionArtifactsDropzone = ({
  modelVersionId,
}: ModelVersionArtifactsDropzoneProps) => {
  const openRef = useRef<(() => void) | null>(null);
  const [opened, { close, open }] = useDisclosure(false);

  const {
    fileProgress,
    files,
    removeFile,
    resetState,
    setFiles,
    uploadAllFiles,
    uploading,
  } = useFileUpload(modelVersionId);

  const handleUploadComplete = useCallback(
    (hasErrors: boolean, hasSuccess: boolean) => {
      if (!hasErrors) {
        close();
        notifications.show({
          message: `Successfully uploaded ${files.length} file${files.length > 1 ? 's' : ''}`,
          title: 'Success',
        });
        resetState();
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
    },
    [files.length, close, resetState],
  );

  const uploadFiles = useCallback(async () => {
    await uploadAllFiles(files);

    const hasErrors = Object.values(fileProgress).some(
      (f) => f.status === FILE_UPLOAD_STATUS.ERROR,
    );
    const hasSuccess = Object.values(fileProgress).some(
      (f) => f.status === FILE_UPLOAD_STATUS.SUCCESS,
    );

    handleUploadComplete(hasErrors, hasSuccess);
  }, [files, fileProgress, uploadAllFiles, handleUploadComplete]);

  const retryFailedFiles = useCallback(async () => {
    const failedFiles = files.filter(
      (file) => fileProgress[file.name]?.status === FILE_UPLOAD_STATUS.ERROR,
    );

    await uploadAllFiles(failedFiles);

    const stillHasErrors = failedFiles.some(
      (file) => fileProgress[file.name]?.status === FILE_UPLOAD_STATUS.ERROR,
    );

    if (!stillHasErrors) {
      close();
      notifications.show({
        message: 'All failed files uploaded successfully',
        title: 'Success',
      });
      resetState();
    } else {
      const remainingFailedFiles = failedFiles.filter(
        (file) => fileProgress[file.name]?.status === FILE_UPLOAD_STATUS.ERROR,
      );

      setFiles(remainingFailedFiles);

      notifications.show({
        color: 'red',
        message: `Some files are still failing (${remainingFailedFiles.length}).`,
      });
    }
  }, [files, fileProgress, uploadAllFiles, close, resetState, setFiles]);

  return (
    <>
      <FileUploadModal
        fileProgress={fileProgress}
        files={files}
        onClose={close}
        onFileRemove={removeFile}
        onFilesSelect={setFiles}
        onRetry={retryFailedFiles}
        onUpload={uploadFiles}
        opened={opened}
        openRef={openRef}
        uploading={uploading}
      />
      <Button onClick={open}>Add Files</Button>
    </>
  );
};
