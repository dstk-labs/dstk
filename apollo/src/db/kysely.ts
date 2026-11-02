import type { DB } from "./db.js";

import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
// https://github.com/brianc/node-postgres/issues/2819
import pg from "pg";
import { env } from "@/config/env.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
});

const dialect = new PostgresDialect({ pool });

export const db = new Kysely<DB>({
  dialect,
  // Keys inside JSON columns, like model version metadata, are user data and stay as stored
  plugins: [new CamelCasePlugin({ maintainNestedObjectKeys: true })],
});
