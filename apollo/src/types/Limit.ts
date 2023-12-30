enum LimitEnum {
    _10 = 10,
    _25 = 25,
    _50 = 50,
}

export type Limit = `${LimitEnum}` extends `${infer T extends number}` ? T : never;
export const LIMITS = Object.keys(LimitEnum)
    .filter((limit) => !isNaN(Number(limit)))
    .map((limit) => parseInt(limit));
