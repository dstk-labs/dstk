import { builder } from '../../builder.js';

builder.scalarType('Limit', {
    serialize: (n) => n,
    // @ts-expect-error This is a bug, according to the docs this should resolve correctly
    // https://pothos-graphql.dev/docs/guide/scalars#defining-your-own-scalars
    parseValue: (n: number) => {
        if ([10, 25, 50].includes(n)) {
            return n;
        }

        throw new Error('Limit must be 10, 25, or 50');
    },
});
