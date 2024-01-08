import { Edge, PageInfo } from './Cursor';
import type { MLModelVersion } from './MLModelVersion';
import type { StorageProvider } from './StorageProvider';
import type { User } from './User';

export type MLModel = {
    modelId: string;
    storageProvider: StorageProvider;
    currentModelVersion?: MLModelVersion;
    isArchived: boolean;
    modelName: string;
    createdBy: User;
    modifiedBy: User;
    dateCreated: string;
    dateModified: string;
    description: string;
    // TODO: Metadata
};

export type GetMLModel = {
    getMLModel: MLModel;
};

export type MLModelList = {
    listMLModels: {
        edges: Edge<MLModel>[];
        pageInfo: PageInfo;
    };
};

export type CreateMLModel = {
    createModel: MLModel;
};

export type EditMLModel = {
    editModel: MLModel;
};

export type ArchiveMLModel = {
    archiveModel: MLModel;
};
