import { Request } from 'express';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Model } from 'objection';
import Knex from 'knex';
import { knexConfig } from './knexfile.js';
import { schema } from './graphql/index.js';

const knex = Knex(knexConfig.development);
Model.knex(knex);

const context = async ({ req }: { req: Request }) => {
    // simple auth check on every request
    const auth = (req.headers && req.headers.authorization) || '';
    return null;
};

const server = new ApolloServer({
    schema,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
