import { z } from 'zod/v4';
import { create } from 'zustand';

export const LIMIT = [10, 25, 50] as const;
export const limitSchema = z.coerce
  .number()
  .refine(
    (val): val is (typeof LIMIT)[number] => LIMIT.includes(val as Limit),
    {
      message: `Limit must be one of ${LIMIT.join(', ')}`,
    },
  );

export type Limit = (typeof LIMIT)[number];

const LIMIT_KEY = 'dstkLimit';
const DEFAULT_LIMIT: Limit = 10;

export const useLimitStore = create<{
  limit: Limit;
  setLimit: (newLimit: Limit) => void;
}>((set) => ({
  limit:
    (parseInt(localStorage.getItem(LIMIT_KEY) || '') as Limit) || DEFAULT_LIMIT,
  setLimit: (newLimit) => {
    localStorage.setItem(LIMIT_KEY, newLimit.toString());
    set({ limit: newLimit });
  },
}));
