import type { FileWithPath } from "@mantine/dropzone";
import type { FileProgress } from "../types";
import { Dropzone } from "@mantine/dropzone";
import { CloudUploadIcon } from "lucide-react";

import { Modal } from "@/components/modal/Modal";
import { ModalFooter } from "@/components/modalFooter/ModalFooter";
import { formatFileSize } from "@/utils/formatters";
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
  uploading,
}: FileUploadModalProps) {
  const hasErrors = files.some(
    file => fileProgress[file.name]?.status === FILE_UPLOAD_STATUS.ERROR,
  );
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <Modal disabled={uploading} onClose={onClose} opened={opened} size={540} title="Upload Files">
      <Dropzone
        disabled={uploading}
        loading={uploading}
        multiple
        onDrop={dropped => onFilesSelect([...files, ...dropped])}
      >
        <div style={{ pointerEvents: "none", textAlign: "center" }}>
          <CloudUploadIcon
            size={32}
            style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-2)" }}
          />
          <div
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--font-size-xs)",
              fontWeight: "var(--font-light)",
              marginBottom: "var(--space-1)",
            }}
          >
            <strong style={{ color: "var(--sky-300)", fontWeight: "var(--font-regular)" }}>
              Click to browse
            </strong>
            {" "}
            or drag and drop
          </div>
          <div
            style={{
              color: "var(--color-text-muted)",
              fontSize: "var(--font-size-3xs)",
              fontWeight: "var(--font-light)",
            }}
          >
            Any file type · Large files upload in 64 MB parts
          </div>
        </div>
      </Dropzone>

      {files.length > 0 && (
        <div style={{ marginTop: "var(--space-4)" }}>
          <div
            style={{
              color: "var(--color-text-muted)",
              fontSize: "var(--font-size-2xs)",
              fontWeight: "var(--font-light)",
              marginBottom: "var(--space-2)",
            }}
          >
            {files.length}
            {" "}
            {files.length === 1 ? "file" : "files"}
            {" · "}
            {formatFileSize(totalSize)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", maxHeight: 260, overflowY: "auto" }}>
            {files.map(file => (
              <FilePreview
                file={file}
                key={file.path}
                onRemove={() => onFileRemove(file.path!)}
                progress={fileProgress[file.name]}
                uploading={uploading}
              />
            ))}
          </div>
        </div>
      )}

      <ModalFooter
        disabled={files.length === 0}
        loading={uploading}
        onCancel={onClose}
        onSubmit={hasErrors ? onRetry : onUpload}
        submitLabel={hasErrors ? "Retry failed files" : "Upload"}
        tone={hasErrors ? "danger" : "primary"}
      />
    </Modal>
  );
}
