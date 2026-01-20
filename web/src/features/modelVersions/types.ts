import type { FileWithPath } from "@mantine/dropzone";

import type { FILE_UPLOAD_STATUS } from "./constants";

export type FileProgress = {
  progress: number;
  status: FileUploadStatus;
};

export type FileUploadState = {
  fileProgress: Record<string, FileProgress>;
  files: FileWithPath[];
  uploading: boolean;
};

export type FileUploadStatus
  = (typeof FILE_UPLOAD_STATUS)[keyof typeof FILE_UPLOAD_STATUS];

export type MultipartUploadMethods
  = | "abortMultipartUpload"
    | "createMultipartUpload"
    | "finalizeMultipartUpload"
    | "uploadPart";
