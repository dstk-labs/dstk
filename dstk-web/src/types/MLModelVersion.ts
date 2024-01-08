import { MLModel } from './MLModel';
import { User } from './User';

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

export type MLModelVersionList = {
    listMLModelVersions: MLModelVersion[];
};

export type CreateMLModelVersion = {
    createModelVersion: MLModelVersion;
};
