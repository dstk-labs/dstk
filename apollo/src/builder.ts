import SchemaBuilder from '@pothos/core';
import type { Limit } from './types/Limit.js';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import { auth } from './utils/auth.js';

export const builder = new SchemaBuilder<{
    AuthScopes: {
        anonymousRequest: boolean;
        loggedIn: boolean;
    };
    Context: {
        user: typeof auth.$Infer.Session.user | null;
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
            anonymousRequest: !!!context.user?.user_id,
            loggedIn: !!context.user?.user_id,
        }),
    },
});

builder.queryType();
builder.mutationType();
