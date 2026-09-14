import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { UploadIcon } from "lucide-react";
import { useCallback } from "react";

import { FileUploadModal } from "@/features/modelVersions/components/FileUploadModal";
import { FILE_UPLOAD_STATUS } from "@/features/modelVersions/constants";
import { useFileUpload } from "@/features/modelVersions/hooks/useFileUpload";

type UploadArtifactsProps = {
  modelVersionId: string;
};

export function UploadArtifacts({ modelVersionId }: UploadArtifactsProps) {
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

  const handleClose = useCallback(() => {
    close();
    resetState();
  }, [close, resetState]);

  const uploadFiles = useCallback(async () => {
    const failed = await uploadAllFiles(files);

    if (failed.length === 0) {
      notifications.show({
        color: "green",
        message: `Uploaded ${files.length} file${files.length > 1 ? "s" : ""}`,
        title: "Upload complete",
      });
      handleClose();
      return;
    }

    notifications.show({
      color: "red",
      message: failed.length === files.length
        ? "All file uploads failed."
        : "Some files uploaded, but others failed. Retry the failed files.",
      title: "Upload issues",
    });
  }, [files, uploadAllFiles, handleClose]);

  const retryFailedFiles = useCallback(async () => {
    const failedFiles = files.filter(
      file => fileProgress[file.name]?.status === FILE_UPLOAD_STATUS.ERROR,
    );

    const stillFailing = await uploadAllFiles(failedFiles);

    if (stillFailing.length === 0) {
      notifications.show({
        color: "green",
        message: "All failed files uploaded successfully",
        title: "Upload complete",
      });
      handleClose();
      return;
    }

    setFiles(stillFailing);
    notifications.show({
      color: "red",
      message: `${stillFailing.length} file${stillFailing.length > 1 ? "s are" : " is"} still failing.`,
      title: "Upload issues",
    });
  }, [files, fileProgress, uploadAllFiles, handleClose, setFiles]);

  return (
    <>
      <FileUploadModal
        fileProgress={fileProgress}
        files={files}
        onClose={handleClose}
        onFileRemove={removeFile}
        onFilesSelect={setFiles}
        onRetry={retryFailedFiles}
        onUpload={uploadFiles}
        opened={opened}
        uploading={uploading}
      />
      <Button leftSection={<UploadIcon size={14} />} onClick={open} size="sm" variant="default">
        Upload files
      </Button>
    </>
  );
}
