import SchemaBuilder from '@pothos/core';

export const builder = new SchemaBuilder<{
    Context: {
        user?: {
            id: number;
        };
    };
    DefaultFieldNullability: true;
}>({
    defaultFieldNullability: true,
});

builder.queryType();
builder.mutationType();
