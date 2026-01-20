import type { Response } from "express";
import type { Limit } from "./types/limit.js";
import type { auth } from "./utils/auth.js";
import SchemaBuilder from "@pothos/core";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";

type Session = typeof auth.$Infer.Session.session;
/* user_id is always populated inside of postgres, but we mark it
as optional in the auth config so we don't have to provide it
a value when creating an account. */
type User = Omit<typeof auth.$Infer.Session.user, "user_id"> & {
  user_id: string;
};

export const builder = new SchemaBuilder<{
  AuthScopes: {
    anonymousRequest: boolean;
    loggedIn: boolean;
  };
  Context: {
    headers: Headers;
    res: Response;
    session: Session;
    user: User;
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
    authScopes: async context => ({
      anonymousRequest: !context.user.user_id,
      loggedIn: !!context.user.user_id,
    }),
  },
});

builder.queryType();
builder.mutationType();
