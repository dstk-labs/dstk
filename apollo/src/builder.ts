import SchemaBuilder from '@pothos/core';

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
    Scalars: {
        Limit: {
            Input: number;
            Output: 10 | 25 | 50;
        };
    };
}>({
    defaultFieldNullability: true,
});

builder.queryType();
builder.mutationType();
