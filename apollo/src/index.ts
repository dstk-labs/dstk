import { ApolloServer, HeaderMap } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { fromNodeHeaders, toNodeHandler } from 'better-auth/node';
import express from 'express';
import type { Request, Response } from 'express';
import http from 'http';
import { Model } from 'objection';
import Knex from 'knex';
import { knexConfig } from './knexfile.js';
import { schema } from './graphql/index.js';
import { auth } from './utils/auth.js';
import { GraphQLError } from 'graphql';

const knex = Knex(knexConfig.development);
Model.knex(knex);

const app = express();
const httpServer = http.createServer(app);

app.all('/api/auth/*splat', toNodeHandler(auth));

const apollo = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

const createContext = async ({ req }: { req: Request }) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
        throw new GraphQLError('Authentication token is invalid', {
            extensions: {
                code: 'UNAUTHENTICATED',
                http: { status: 401 },
            },
        });
    }

    return {
        user: session.user,
    };
};

app.use('/graphql', express.json(), async ({ req, res }: { req: Request; res: Response }) => {
    try {
        const httpGraphQLResponse = await apollo.executeHTTPGraphQLRequest({
            httpGraphQLRequest: {
                body: req.method === 'POST' ? await req.body : undefined,
                headers: new HeaderMap(
                    Object.entries(req.headers).map(([key, value]) => [
                        key,
                        Array.isArray(value) ? value.join(', ') : value || '',
                    ]),
                ),
                method: req.method,
                search: new URL(req.url).search,
            },
            context: async () => createContext({ req }),
        });

        const { headers, body, status } = httpGraphQLResponse;

        for (const [headerKey, headerValue] of headers) {
            res.setHeader(headerKey, headerValue);
        }

        res.status(status ?? 200);

        if (body.kind === 'complete') {
            res.send(body.string);
        }

        // TOOD: Might not need this, but leaving to be safe
        if (body.kind === 'chunked') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            for await (const chunk of body.asyncIterator) {
                res.write(chunk);
            }
            res.end();
        }
    } catch (error) {
        res.status(500).json({ error });
    }
});

await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at ${httpServer.address}`);
