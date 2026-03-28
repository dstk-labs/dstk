import { config } from "dotenv";
import { z } from "zod";

config();

const envVariables = z.object({
  DATABASE_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default("https://sandbox.embed.apollographql.com,http://localhost:5173,http://127.0.0.1:5173"),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string().default("http://localhost:4000"),
  APP_URL: z.string().default("http://localhost:5173"),
});

export const env = envVariables.parse(process.env);
