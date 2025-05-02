import type { DB } from './db.js';
import { Kysely, PostgresDialect } from 'kysely';

// https://github.com/brianc/node-postgres/issues/2819
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
});

const dialect = new PostgresDialect({ pool });

export const db = new Kysely<DB>({
    dialect,
});
