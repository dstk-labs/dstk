import type { FileWithPath } from "@mantine/dropzone";
import type { RefObject } from "react";
import type { FileProgress } from "../types";
import { Button, Flex, Group, SimpleGrid, Text } from "@mantine/core";

import { Dropzone } from "@mantine/dropzone";

import { Modal } from "@/components/modal/Modal";
import { FILE_UPLOAD_STATUS } from "../constants";
import { FilePreview } from "./FilePreview";

type FileUploadModalProps = {
  fileProgress: Record<string, FileProgress>;
  files: FileWithPath[];
  onClose: () => void;
  onFileRemove: (filePath: string) => void;
  onFilesSelect: (files: FileWithPath[]) => void;
  onRetry: () => void;
  onUpload: () => void;
  opened: boolean;
  openRef: RefObject<(() => void) | null>;
  uploading: boolean;
};

export function FileUploadModal({
  fileProgress,
  files,
  onClose,
  onFileRemove,
  onFilesSelect,
  onRetry,
  onUpload,
  opened,
  openRef,
  uploading,
}: FileUploadModalProps) {
  const hasErrors = files.some(
    file => fileProgress[file.name]?.status === FILE_UPLOAD_STATUS.ERROR,
  );

  return (
    <Modal
      disabled={uploading}
      onClose={onClose}
      opened={opened}
      size="lg"
      title="Add Files"
    >
      <Dropzone
        loading={uploading}
        multiple
        onDrop={onFilesSelect}
        openRef={openRef}
      >
        <Group
          gap="xl"
          justify="center"
          mih={110}
          style={{ pointerEvents: "none" }}
        >
          <div>
            <Text inline size="md">
              Drag objects here or click to select files
            </Text>
            <Text c="dimmed" inline mt={7} size="sm">
              We should probably check mime types
            </Text>
          </div>
        </Group>
      </Dropzone>

      {files.length > 0 && (
        <SimpleGrid mt="sm" w="100%">
          {files.map(file => (
            <FilePreview
              file={file}
              key={file.path}
              onRemove={() => onFileRemove(file.path!)}
              progress={fileProgress[file.name]}
              uploading={uploading}
            />
          ))}
        </SimpleGrid>
      )}

      <Flex align="center" justify="end" mt="xl">
        {hasErrors
          ? (
              <Button color="red" loading={uploading} onClick={onRetry} radius="md">
                Retry Failed Files
              </Button>
            )
          : (
              <Button
                color="blue"
                disabled={files.length === 0}
                loading={uploading}
                onClick={onUpload}
                radius="md"
                type="submit"
              >
                Submit
              </Button>
            )}
      </Flex>
    </Modal>
  );
}
