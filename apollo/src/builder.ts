import type { Response } from "express";
import type { Limit } from "./types/limit.js";
import type { auth } from "./utils/auth.js";
import SchemaBuilder from "@pothos/core";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";

type Session = typeof auth.$Infer.Session.session;
type User = typeof auth.$Infer.Session.user;

export type Context = {
  headers: Headers;
  res: Response;
  session: Session;
  user: User;
};

export const builder = new SchemaBuilder<{
  AuthScopes: {
    anonymousRequest: boolean;
    loggedIn: boolean;
  };
  Context: Context;
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
      anonymousRequest: !context.user.id,
      loggedIn: !!context.user.id,
    }),
  },
});

builder.queryType();
builder.mutationType();
