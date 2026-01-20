import type { FileWithPath } from "@mantine/dropzone";
import type { FileProgress } from "../types";
import { ActionIcon, Group, Paper, Progress, Text } from "@mantine/core";

import { FileIcon, TrashIcon } from "lucide-react";

import { formatFileSize } from "@/utils/formatters";
import { FILE_UPLOAD_STATUS } from "../constants";

type FilePreviewProps = {
  file: FileWithPath;
  onRemove: () => void;
  progress?: FileProgress;
  uploading: boolean;
};

export function FilePreview({
  file,
  onRemove,
  progress,
  uploading,
}: FilePreviewProps) {
  const currentProgress = progress?.progress ?? 0;
  const status = progress?.status ?? FILE_UPLOAD_STATUS.PENDING;

  const getProgressColor = () => {
    switch (status) {
      case FILE_UPLOAD_STATUS.ERROR:
        return "red";
      case FILE_UPLOAD_STATUS.SUCCESS:
        return "green";
      default:
        return "blue";
    }
  };

  return (
    <Paper p="md" radius="md" shadow="xs" withBorder>
      <Group align="center" justify="space-between">
        <Group gap="sm" style={{ flex: 1 }}>
          <FileIcon color="gray" size={24} />
          <div>
            <Text fw={500} lineClamp={1} size="sm">
              {file.name}
            </Text>
            <Text c="dimmed" size="xs">
              {formatFileSize(file.size)}
            </Text>
          </div>
          {uploading && (
            <Progress
              animated={status === FILE_UPLOAD_STATUS.UPLOADING}
              color={getProgressColor()}
              value={currentProgress}
              w="100%"
            />
          )}
        </Group>
        <ActionIcon
          color="gray"
          disabled={uploading}
          onClick={onRemove}
          variant="subtle"
        >
          <TrashIcon size={16} />
        </ActionIcon>
      </Group>
    </Paper>
  );
}
