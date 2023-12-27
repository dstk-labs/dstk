import { MLModelVersion } from './MLModelVersion';
import { StorageProvider } from './StorageProvider';

export type MLModel = {
    modelId: string;
    storageProvider: StorageProvider;
    currentModelVersion?: MLModelVersion;
    isArchived: boolean;
    modelName: string;
    createdBy: string; // TODO: User Object
    modifiedBy: string; // TODO: User Object
    dateCreated: string;
    dateModified: string;
    description: string;
    // TODO: Metadata
};

export type MLModelList = {
    listMLModels: MLModel[];
};
