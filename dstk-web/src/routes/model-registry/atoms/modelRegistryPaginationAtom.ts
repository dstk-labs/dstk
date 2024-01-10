import { atom } from 'jotai';
import type { Limit } from '@/types/Limit';

type ModelRegistryPaginationInput = {
    first: Limit;
    continuationTokens: (string | undefined)[];
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    modelName?: string;
};

export const modelRegistryPaginationAtom = atom<ModelRegistryPaginationInput>({
    first: 10,
    continuationTokens: [undefined],
    hasPreviousPage: false,
    hasNextPage: false,
    modelName: undefined,
});
