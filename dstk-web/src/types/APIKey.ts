export type APIKey = {
    apiKey: string;
    apiKeyId: string;
    dateCreated: string;
    isArchived: boolean;
    userId: string;
};

export type APIKeyList = {
    listApiKeys: APIKey[];
};

export type CreateAPIKey = {
    createAPIKey: APIKey;
};

export type ArchiveAPIKey = {
    archiveApiKey: APIKey;
};
