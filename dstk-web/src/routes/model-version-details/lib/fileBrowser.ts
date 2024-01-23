import type { StorageProviderObject, StorageProviderObjectList } from '@/types/StorageProvider';

export const isDirectory = (filePath: string): boolean => filePath.split('/').length > 1;

export const createDirectory = (objects: StorageProviderObjectList) => {
    const edges = objects.listObjectsForModelVersion.edges;

    // Get All Directories and Files Returned from query
    const directories: StorageProviderObject[] = [];
    const files: StorageProviderObject[] = [];

    // Add directory only if it doesn't exist
    for (const edge of edges) {
        if (isDirectory(edge.node.name)) {
            if (!directories.includes(edge.node)) {
                directories.push(edge.node);
            }
        }
    }

    for (const edge of edges) {
        if (!isDirectory(edge.node.name)) {
            files.push(edge.node);
        }
    }

    return {
        directories: directories,
        files: files,
    };
};
