import SchemaBuilder from '@pothos/core';
import RelayPlugin from '@pothos/plugin-relay';

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
    plugins: [RelayPlugin],
    relayOptions: {},
    defaultFieldNullability: true,
});

builder.queryType();
builder.mutationType();
