import SchemaBuilder from '@pothos/core';

export const builder = new SchemaBuilder<{
    Context: {
        // userAuth: {
        //     userId: string;
        //     dateCreated: number;
        //     iat: number;
        //     exp: number;
        // };
    };
    DefaultFieldNullability: true;
}>({
    defaultFieldNullability: true,
});

builder.queryType();
builder.mutationType();
