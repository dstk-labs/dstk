import { atom } from 'jotai';
import type { Limit } from '@/types/Limit';

type ListObjectsPaginationInput = {
    first: Limit;
    continuationTokens: (string | undefined)[];
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    prefixes: (string | undefined)[];
};

export const listObjectsPaginationAtom = atom<ListObjectsPaginationInput>({
    first: 10,
    continuationTokens: [undefined],
    hasPreviousPage: false,
    hasNextPage: false,
    prefixes: [undefined],
});
