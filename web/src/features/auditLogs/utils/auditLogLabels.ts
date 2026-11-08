import type { AuditAction, AuditResourceType } from "@/graphql/types";

export const ACTION_LABELS = {
  archived: "Archived",
  created: "Created",
  edited: "Edited",
  file_uploaded: "Uploaded file",
  published: "Published",
  unarchived: "Restored",
} satisfies Record<AuditAction, string>;

export const RESOURCE_TYPE_LABELS = {
  model: "Model",
  model_version: "Model version",
  project: "Project",
  storage_provider: "Storage provider",
} satisfies Record<AuditResourceType, string>;

export function isAuditAction(value: unknown): value is AuditAction {
  return typeof value === "string" && Object.hasOwn(ACTION_LABELS, value);
}

export function isAuditResourceType(value: unknown): value is AuditResourceType {
  return typeof value === "string" && Object.hasOwn(RESOURCE_TYPE_LABELS, value);
}

function uploadedFilename(details: unknown) {
  if (typeof details === "object" && details !== null && "filename" in details && typeof details.filename === "string")
    return details.filename;
  return "a file";
}

export function describeAuditLog({ action, details, resourceType }: {
  action: AuditAction;
  details?: unknown;
  resourceType: AuditResourceType;
}) {
  const resource = RESOURCE_TYPE_LABELS[resourceType].toLowerCase();

  if (action === "file_uploaded")
    return `Uploaded ${uploadedFilename(details)} to ${resource}`;

  return `${ACTION_LABELS[action]} ${resource}`;
}
