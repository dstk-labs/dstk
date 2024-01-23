import type { Edge, PageInfo } from './Cursor';
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

export type StorageProviderObject = {
    lastModified: string;
    name: string;
    size: number;
};

export type StorageProviderList = {
    listStorageProviders: StorageProvider[];
};

export type StorageProviderObjectList = {
    listObjectsForModelVersion: {
        edges: Edge<StorageProviderObject>[];
        pageInfo: PageInfo;
    };
};
