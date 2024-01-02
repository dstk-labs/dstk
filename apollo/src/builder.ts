import SchemaBuilder from '@pothos/core';

import type { Limit } from './types/Limit.js';

export const builder = new SchemaBuilder<{
    Context: {
        userAuth: {
            userId: string;
            dateCreated: number;
            iat: number;
            exp: number;
        };
    };
    DefaultFieldNullability: true;
}>({
    defaultFieldNullability: true,
});

builder.queryType();
builder.mutationType();
