import { MLModel } from './MLModel';

export type MLModelVersion = {
    modelVersionId: string;
    modelId: MLModel;
    isArchived: boolean;
    isFinalized: boolean;
    createdBy: string; // TODO: User Object
    numericVersion: number;
    description: string;
    // TODO: metadata
    dateCreated: string;
    s3Prefix: string;
};

export type CreateMLModelVersion = {
    createModelVersion: MLModelVersion;
};
