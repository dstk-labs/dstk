import type { FileWithPath } from "@mantine/dropzone";
import type { FileProgress } from "../types";
import { ActionIcon, Progress } from "@mantine/core";
import { FileIcon, XIcon } from "lucide-react";

import { formatFileSize } from "@/utils/formatters";
import { FILE_UPLOAD_STATUS } from "../constants";

type FilePreviewProps = {
  file: FileWithPath;
  onRemove: () => void;
  progress?: FileProgress;
  uploading: boolean;
};

const STATUS_STYLES = {
  [FILE_UPLOAD_STATUS.ERROR]: { color: "var(--color-error)", label: "Failed" },
  [FILE_UPLOAD_STATUS.PENDING]: { color: "var(--sky-400)", label: "Ready" },
  [FILE_UPLOAD_STATUS.SUCCESS]: { color: "var(--color-success)", label: "Complete" },
  [FILE_UPLOAD_STATUS.UPLOADING]: { color: "var(--sky-400)", label: "Uploading" },
};

export function FilePreview({
  file,
  onRemove,
  progress,
  uploading,
}: FilePreviewProps) {
  const currentProgress = progress?.progress ?? 0;
  const status = progress?.status ?? FILE_UPLOAD_STATUS.PENDING;
  const statusStyle = STATUS_STYLES[status];
  const showProgress = uploading || status !== FILE_UPLOAD_STATUS.PENDING;

  return (
    <div
      style={{
        alignItems: "center",
        background: "var(--color-bg-tertiary)",
        border: `var(--border-width) solid ${
          status === FILE_UPLOAD_STATUS.ERROR
            ? "rgba(224, 108, 117, 0.3)"
            : "var(--color-border-default)"
        }`,
        borderRadius: "var(--radius-md)",
        display: "flex",
        gap: "var(--space-3)",
        padding: "10px 14px",
      }}
    >
      <FileIcon size={16} style={{ color: "var(--color-text-muted)" }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: "var(--space-2)",
            justifyContent: "space-between",
            marginBottom: showProgress ? 6 : 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--font-size-2xs)",
              fontWeight: "var(--font-regular)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {file.name}
          </span>
          <span
            style={{
              color: showProgress ? statusStyle.color : "var(--color-text-muted)",
              flexShrink: 0,
              fontSize: "var(--font-size-3xs)",
              fontWeight: "var(--font-light)",
            }}
          >
            {showProgress
              ? status === FILE_UPLOAD_STATUS.UPLOADING
                ? `${Math.round(currentProgress)}%`
                : statusStyle.label
              : formatFileSize(file.size)}
          </span>
        </div>
        {showProgress && (
          <Progress
            animated={status === FILE_UPLOAD_STATUS.UPLOADING}
            color={statusStyle.color}
            size={3}
            value={status === FILE_UPLOAD_STATUS.SUCCESS ? 100 : currentProgress}
          />
        )}
      </div>
      <ActionIcon
        aria-label={`Remove ${file.name}`}
        disabled={uploading}
        onClick={onRemove}
        size={24}
        variant="subtle"
      >
        <XIcon size={14} />
      </ActionIcon>
    </div>
  );
}
