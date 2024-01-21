import type { Edge, PageInfo } from './Cursor';
import type { MLModel } from './MLModel';
import type { User } from './User';

export type MLModelVersion = {
    modelVersionId: string;
    modelId: MLModel;
    isArchived: boolean;
    isFinalized: boolean;
    createdBy: User;
    numericVersion: number;
    description: string;
    // TODO: metadata
    dateCreated: string;
    s3Prefix: string;
};

export type GetMLModelVersion = {
    getMLModelVersion: MLModelVersion;
};

export type MLModelVersionList = {
    listMLModelVersions: {
        edges: Edge<MLModelVersion>[];
        pageInfo: PageInfo;
    };
};

export type CreateMLModelVersion = {
    createModelVersion: MLModelVersion;
};
