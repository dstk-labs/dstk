type RegistryErrorName =
    | 'ARCHIVED_STORAGE_ERROR'
    | 'ARCHIVED_MODEL_ERROR'
    | 'ARCHIVED_MODEL_VERSION_ERROR'
    | 'PUBLISHED_MODEL_VERSION_ERROR'
    | 'MISSING_UPLOAD_ID_ERROR'
    | 'MISSING_PART_NUM_ERROR'
    | 'MULTIPART_FINALIZATION_ERROR';

const RegistryErrorMessages = {
    ARCHIVED_STORAGE_ERROR: 'New model versions cannot be added to an archived storage provider',
    ARCHIVED_MODEL_ERROR: 'New model versions cannot be added to archived models',
    ARCHIVED_MODEL_VERSION_ERROR: 'An archived model version cannot be modified',
    PUBLISHED_MODEL_VERSION_ERROR: 'Published model versions cannot be modified',
    MISSING_UPLOAD_ID_ERROR: 'An Upload ID must be supplied for this operation',
    MISSING_PART_NUM_ERROR: 'A Part Number must be supuplied for this operation',
    MULTIPART_FINALIZATION_ERROR:
        'Uploaded parts and their ETags must be supplied to finalize a MPU',
};

export class RegistryOperationError extends Error {
    name: RegistryErrorName;
    message: string;

    constructor({ name }: { name: RegistryErrorName }) {
        super();
        this.name = name;
        this.message = RegistryErrorMessages[name];
    }
};

type AccountErrorName =
    | 'ACCOUNT_REGISTRATION_ERROR'
    | 'USERNAME_IN_USE_ERROR';

const AccountErrorMessages = {
    ACCOUNT_REGISTRATION_ERROR: 'Something went wrong and we were not able to complete this action',
    USERNAME_IN_USE_ERROR: 'An account already exists with this username',
};

export class AccountError extends Error {
    name: AccountErrorName;
    message: string;

    constructor({ name }: { name: AccountErrorName }) {
        super();
        this.name = name;
        this.message = AccountErrorMessages[name];
    }
};