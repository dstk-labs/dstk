import type { DB } from "./db.js";
import dotenv from "dotenv";

import { Kysely, PostgresDialect } from "kysely";
// https://github.com/brianc/node-postgres/issues/2819
import pg from "pg";
import { env } from "../config/env.js";

dotenv.config();
const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
});

const dialect = new PostgresDialect({ pool });

export const db = new Kysely<DB>({
  dialect,
});
