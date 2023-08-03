import { knexSnakeCaseMappers } from "objection"

export const knexConfig = {
  development: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: 'postgres',
    },
    pool: {
      min: 2,
      max: 10,
    },
    ...knexSnakeCaseMappers()
  },
}