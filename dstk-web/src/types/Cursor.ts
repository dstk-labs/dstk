export type Edge<T> = {
    cursor: string;
    node: T;
};

export type PageInfo = {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    continuationToken: string;
};
