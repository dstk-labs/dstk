import { z } from 'zod';
import { config } from 'dotenv';

config();

const envVariables = z.object({
    DATABASE_URL: z.string(),
    SMTP_HOST: z.string(),
    SMTP_PORT: z.coerce.number(),
});

export const env = envVariables.parse(process.env);
