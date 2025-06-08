import { ApolloServer } from '@apollo/server';
import { schema } from './graphql/index.js';
import { auth } from './utils/auth.js';
import { fromNodeHeaders } from 'better-auth/node';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cookieparser from 'cookie-parser';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 4000;

const app = express();
const httpServer = http.createServer(app);

const serverPlugins = [ApolloServerPluginDrainHttpServer({ httpServer })];
if (process.env.NODE_ENV === 'dev') {
    serverPlugins.push(ApolloServerPluginLandingPageLocalDefault({ includeCookies: true }));
}
const server = new ApolloServer({
    schema,
    plugins: serverPlugins,
});

await server.start();

app.use(
    '/graphql',
    cors<cors.CorsRequest>({
        origin: ['https://sandbox.embed.apollographql.com', 'http://localhost:5173', 'http://127.0.0.1:5173'],
        credentials: true,
    }),
    express.json(),
    cookieparser(),
    // @ts-expect-error middleware works fine, typescript is just inferring package types incorrectly
    expressMiddleware(server, {
        context: async ({ req, res }) => {
            const headers = fromNodeHeaders(req.headers);

            const session = await auth.api.getSession({
                headers: headers,
            });

            if (session?.session && session?.user) {
                return {
                    headers: headers,
                    res: res,
                    session: session?.session,
                    user: session?.user,
                };
            }

            return {
                headers: headers,
                res: res,
                session: undefined,
                user: {
                    userId: undefined,
                },
            };
        },
    }),
);

await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
