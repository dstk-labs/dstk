import { builder } from '../../builder.js';
import { InputError } from '../../utils/errors.js';
import { LIMITS, type Limit } from '../../types/Limit.js';

builder.scalarType('Limit', {
    serialize: (n) => n,
    // @ts-expect-error This is a bug, according to the
    // docs this should resolve correctly
    // https://pothos-graphql.dev/docs/guide/scalars#defining-your-own-scalars
    parseValue: (n: Limit) => {
        if (LIMITS.includes(n)) {
            return n;
        }

        throw new InputError({ name: 'INVALID_LIMIT_ERROR' });
    },
    description: 'Valid page sizes are 10, 25, and 50 records',
});
