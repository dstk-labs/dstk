import http from "node:http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cookieparser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { schema } from "./graphql/index.js";
import { auth } from "./utils/auth.js";

const PORT = env.PORT;
const corsOrigins = env.CORS_ORIGIN.split(",").map(o => o.trim());

const app = express();
const httpServer = http.createServer(app);

const serverPlugins = [ApolloServerPluginDrainHttpServer({ httpServer })];
if (process.env.NODE_ENV === "dev") {
  serverPlugins.push(ApolloServerPluginLandingPageLocalDefault({ includeCookies: true }));
}
const server = new ApolloServer({
  schema,
  plugins: serverPlugins,
});

await server.start();

// Use better-auth rest API endpoints for OAuth callbacks
app.all("/api/auth/callback/*", toNodeHandler(auth));

app.use(
  "/graphql",
  cors<cors.CorsRequest>({
    origin: corsOrigins,
    credentials: true,
  }),
  express.json(),
  cookieparser(),
  // @ts-expect-error middleware works fine, typescript is just inferring package types incorrectly
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      const headers = fromNodeHeaders(req.headers);

      const session = await auth.api.getSession({
        headers,
      });

      if (session?.session && session?.user) {
        return {
          headers,
          res,
          session: session?.session,
          user: session?.user,
        };
      }

      return {
        headers,
        res,
        session: undefined,
        user: {
          id: undefined,
        },
      };
    },
  }),
);

await new Promise<void>(resolve => httpServer.listen({ port: PORT }, resolve));
// eslint-disable-next-line no-console
console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
