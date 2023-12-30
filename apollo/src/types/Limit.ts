export const LIMITS = [10, 25, 50] as const;

type LimitTuple = typeof LIMITS;
export type Limit = LimitTuple[number];
