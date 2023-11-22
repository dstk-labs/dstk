import { knexSnakeCaseMappers } from "objection"

export const knexConfig = {
  development: {
    client: 'pg',
    connection: {
      host: 'dstk-postgres',
      port: 5432,
      user: 'postgres',
      password: 'postgres',
      database: 'dstk_registry',
    },
    pool: {
      min: 2,
      max: 10,
    },
    ...knexSnakeCaseMappers()
  },
}
