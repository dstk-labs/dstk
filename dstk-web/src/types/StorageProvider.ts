export type StorageProvider = {
    providerId: string;
    endpointUrl: string;
    region: string;
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
    createdBy: string; // TODO: User Object
    modifiedBy: string; // TODO: User Object
    owner: string; // TODO: User Object
    dateCreated: string;
    dateModified: string;
    isArchvied: boolean;
};

export type StorageProviderList = {
    listStorageProviders: StorageProvider[];
};
