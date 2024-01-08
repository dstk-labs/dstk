import { User } from './User';

export type StorageProvider = {
    providerId: string;
    endpointUrl: string;
    region: string;
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
    createdBy: User;
    modifiedBy: User;
    owner: User;
    dateCreated: string;
    dateModified: string;
    isArchvied: boolean;
};

export type StorageProviderList = {
    listStorageProviders: StorageProvider[];
};
