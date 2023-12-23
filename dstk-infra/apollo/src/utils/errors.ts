type RegistryErrorName =
    | 'ARCHIVED_STORAGE_ERROR'
    | 'ARCHIVED_MODEL_ERROR'
    | 'ARCHIVED_MODEL_VERSION_ERROR'
    | 'PUBLISHED_MODEL_VERSION_ERROR';

const RegistryErrorMessages = {
    ARCHIVED_STORAGE_ERROR: 'New model versions cannot be added to an archived storage provider',
    ARCHIVED_MODEL_ERROR: 'New model versions cannot be added to archived models',
    ARCHIVED_MODEL_VERSION_ERROR: 'An archived model version cannot be modified',
    PUBLISHED_MODEL_VERSION_ERROR: 'Published model versions cannot be modified',
};

export class RegistryOperationError extends Error {
    name: RegistryErrorName;
    message: string;

    constructor({ name }: { name: RegistryErrorName }) {
        super();
        this.name = name;
        this.message = RegistryErrorMessages[name];
    }
}
