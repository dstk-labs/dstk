export type Edge<TData> = {
    edges: {
        cursor?: string;
        node: TData;
    }[];
    pageInfo: {
        hasPreviousPage: boolean;
        hasNextPage: boolean;
        continuationToken?: string;
    };
};

export type APIKey = {
    apiKey: string;
    apiKeyId: string;
    dateCreated: string;
    isArchived: boolean;
    userId: string;
};


export type MLModel = {
    modelId: string;
    storageProvider: StorageProvider;
    currentModelVersion?: MLModelVersion;
    project: Project;
    isArchived: boolean;
    modelName: string;
    createdBy: User;
    modifiedBy: User;
    dateCreated: string;
    dateModified: string;
    description: string;
    // TODO: Metadata
};

export type MLModelVersion = {
    modelVersionId: string;
    modelId: MLModel;
    isArchived: boolean;
    isFinalized: boolean;
    numericVersion: number;
    description: string;
    dateCreated: string;
    s3Prefix: string;
    createdBy: User;
};

export type Project = {
    projectId: string;
    name: string;
    description: string;
    isArchived: boolean;
    dateCreated: string;
    dateModified: string;
    createdBy: User;
    modifiedBy: User;
};

export type StorageProvider = {
    providerId: string;
    endpointUrl: string;
    region: string;
    bucket: string;
    accessKeyId: string;
    createdBy: User;
    modifiedBy: User;
    owner: User;
    teamId: string;
    dateCreated: string;
    dateModified: string;
    isArchvied: boolean;
};

export type Team = {
    createdBy: User;
    dateCreated: string;
    dateModified: string;
    description: string;
    modifiedBy: User;
    name: string;
    teamId: string;
};

export type User = {
    userId: string;
    isAdmin: boolean;
    isApproved: string;
    isDisabled: boolean;
    realName: string;
    userName: string;
    dateCreated: string;
    dateModified: string;
    primaryEmail: string;
};


