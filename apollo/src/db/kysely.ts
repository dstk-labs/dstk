import { DB } from './db.js';
import { Kysely, PostgresDialect } from 'kysely';

// https://github.com/brianc/node-postgres/issues/2819
import pg from 'pg';
const { Pool } = pg;

const dialect = new PostgresDialect({
    pool: new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 10,
    }),
});

export const db = new Kysely<DB>({
    dialect,
});
