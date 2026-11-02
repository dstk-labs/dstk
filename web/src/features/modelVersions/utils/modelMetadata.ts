export type ModelMetadata = {
  files: string[];
  framework: string;
  frameworkVersion: string;
  modelClass: string;
  params: Record<string, unknown>;
  pythonVersion: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === "string");
}

export function parseModelMetadata(value: unknown): ModelMetadata | null {
  if (!isRecord(value)) {
    return null;
  }

  const files = value.files;
  const framework = value.framework;
  const frameworkVersion = value.framework_version;
  const modelClass = value.model_class;
  const params = value.params;
  const pythonVersion = value.python_version;

  if (
    !isStringArray(files)
    || typeof framework !== "string"
    || typeof frameworkVersion !== "string"
    || typeof modelClass !== "string"
    || !isRecord(params)
    || typeof pythonVersion !== "string"
  ) {
    return null;
  }

  return { files, framework, frameworkVersion, modelClass, params, pythonVersion };
}

export function formatParamValue(value: unknown) {
  return typeof value === "string" ? value : JSON.stringify(value);
}
