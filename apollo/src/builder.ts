import SchemaBuilder from '@pothos/core';
import type { Limit } from './types/Limit.js';
import { ObjectionUser } from './graphql/index.js';

export const builder = new SchemaBuilder<{
    Context: {
        user: ObjectionUser,
    };
    DefaultFieldNullability: true;
    Scalars: {
        Limit: {
            Input: number;
            Output: Limit;
        };
    };
}>({
    defaultFieldNullability: true,
});

builder.queryType();
builder.mutationType();
