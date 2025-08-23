import { ActionIcon, Group, Paper, Progress, Text } from '@mantine/core';
import { type FileWithPath } from '@mantine/dropzone';
import { FileIcon, TrashIcon } from 'lucide-react';

import { FILE_UPLOAD_STATUS } from '../constants';
import { FileProgress } from '../types';

type FilePreviewProps = {
  file: FileWithPath;
  onRemove: () => void;
  progress?: FileProgress;
  uploading: boolean;
};

export const FilePreview = ({
  file,
  onRemove,
  progress,
  uploading,
}: FilePreviewProps) => {
  const currentProgress = progress?.progress ?? 0;
  const status = progress?.status ?? FILE_UPLOAD_STATUS.PENDING;

  const getProgressColor = () => {
    switch (status) {
      case FILE_UPLOAD_STATUS.ERROR:
        return 'red';
      case FILE_UPLOAD_STATUS.SUCCESS:
        return 'green';
      default:
        return 'blue';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Paper p='md' radius='md' shadow='xs' withBorder>
      <Group align='center' justify='space-between'>
        <Group gap='sm' style={{ flex: 1 }}>
          <FileIcon color='gray' size={24} />
          <div>
            <Text fw={500} lineClamp={1} size='sm'>
              {file.name}
            </Text>
            <Text c='dimmed' size='xs'>
              {formatFileSize(file.size)}
            </Text>
          </div>
          {uploading && (
            <Progress
              animated={status === FILE_UPLOAD_STATUS.UPLOADING}
              color={getProgressColor()}
              value={currentProgress}
              w='100%'
            />
          )}
        </Group>
        <ActionIcon
          color='gray'
          disabled={uploading}
          onClick={onRemove}
          variant='subtle'
        >
          <TrashIcon size={16} />
        </ActionIcon>
      </Group>
    </Paper>
  );
};
