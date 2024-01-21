import { atom } from 'jotai';
import type { Limit } from '@/types/Limit';

type ModelVersionPaginationInput = {
    first: Limit;
    continuationTokens: (string | undefined)[];
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    modelName?: string;
};

export const modelVersionPaginationAtom = atom<ModelVersionPaginationInput>({
    first: 10,
    continuationTokens: [undefined],
    hasPreviousPage: false,
    hasNextPage: false,
});
