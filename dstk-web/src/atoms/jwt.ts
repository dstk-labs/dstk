import { atomWithStorage } from 'jotai/utils';

export const jwtAtom = atomWithStorage<string | null>('token', null);
