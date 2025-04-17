import { ApolloServer, HeaderMap } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { fromNodeHeaders, toNodeHandler } from 'better-auth/node';
import express from 'express';
import type { Request, Response } from 'express';
import http from 'node:http';
import { schema } from './graphql/index.js';
import { auth } from './utils/auth.js';
import { type DocumentNode, getOperationAST, GraphQLError, parse } from 'graphql';

const PORT = 4000;

const app = express();
const httpServer = http.createServer(app);

app.all('/api/auth/*splat', toNodeHandler(auth));

const apollo = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// I am beginning to regret not putting the auth into its own server.
const createContext = async ({ req }: { req: Request }) => {
    const body = req.body;

    /* Do not allow non-graphql operations to hit the server */
    let parsedQuery: DocumentNode;
    try {
        parsedQuery = parse(body.query);
    } catch {
        throw new GraphQLError('Invalid GraphQL query', {
            extensions: { code: 'BAD_REQUEST', http: { status: 400 } },
        });
    }

    const operationAST = getOperationAST(parsedQuery, body.operationName);

    /* Apollo server runs introspection queries that are only used to update
       the schema within the UI. This allows introspection queries to come
       through by explicitly setting to auth context to nothing. */
    if (operationAST?.operation === 'query' && body.query.includes('__schema')) {
        return { user: null, session: null };
    }

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
        headers: req.headers,
        user: session.user,
        session: session.session,
    };
};

await apollo.start();
app.use('/graphql', express.json(), async (req: Request, res: Response) => {
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
                search: new URL(req.url, `http://${req.headers.host}`).search,
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

await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
console.log(`🚀 Server ready at http://localhost:${PORT}`);
