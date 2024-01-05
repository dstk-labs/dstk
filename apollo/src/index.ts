import { ApolloServer, BaseContext } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Model } from 'objection';
import Knex from 'knex';
import { knexConfig } from './knexfile.js';
import { schema } from './graphql/index.js';
import { JWTValidator } from './utils/jwt.js';
import { JwtPayload } from 'jsonwebtoken';
import { IncomingMessage, ServerResponse } from 'http';
import { ObjectionUser } from './graphql/index.js';

const JWT = new JWTValidator();
const knex = Knex(knexConfig.development);
Model.knex(knex);

const createContext = async ({ res, req }: { res: ServerResponse; req: IncomingMessage }) => {
    // simple auth check on every request
    const auth = (req.headers && req.headers.authorization) || '';
    if (auth.startsWith('Bearer ')) {
        const token = auth.substring(7, auth.length);
        try {
            const verifiedToken = JWT.verifySession(token) as JwtPayload;
            const user = (await ObjectionUser.query().findById(
                verifiedToken.userId,
            )) as ObjectionUser;

            return { user: user };
        } catch (err) {
            // throw new GraphQLError('Authentication token is invalid', {
            //     extensions: {
            //       code: 'UNAUTHENTICATED',
            //       http: { status: 401 },
            //     },
            // });
            return { user: ObjectionUser };
        }
    } else if (auth.startsWith('Basic ')) {
        const token = auth.substring(6, auth.length);
        try {
            // const verifiedToken = JWT.verifySession(token) as JwtPayload;
            return { user: ObjectionUser };
        } catch (err) {
            // throw new GraphQLError('Authentication token is invalid', {
            //     extensions: {
            //       code: 'UNAUTHENTICATED',
            //       http: { status: 401 },
            //     },
            // });
            return { user: ObjectionUser };
        }
    } else {
        // throw new GraphQLError('User is not authenticated', {
        //     extensions: {
        //       code: 'UNAUTHENTICATED',
        //       http: { status: 401 },
        //     },
        // });
        return { user: ObjectionUser };
    }
};

const server = new ApolloServer({
    schema,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: createContext,
});

console.log(`🚀  Server ready at: ${url}`);
