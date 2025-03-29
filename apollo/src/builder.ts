import SchemaBuilder from '@pothos/core';
import type { Limit } from './types/Limit.js';
import { ObjectionUser } from './graphql/index.js';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';

export const builder = new SchemaBuilder<{
    AuthScopes: {
        anonymousRequest: boolean;
        loggedIn: boolean;
    };
    Context: {
        user: ObjectionUser;
    };
    DefaultFieldNullability: true;
    Scalars: {
        Limit: {
            Input: number;
            Output: Limit;
        };
    };
}>({
    plugins: [ScopeAuthPlugin],
    scopeAuth: {
        authorizeOnSubscribe: true,
        authScopes: async (context) => ({
            anonymousRequest: !!!context.user?.userId,
            loggedIn: !!context.user?.userId,
        }),
    },
});

builder.queryType();
builder.mutationType();
