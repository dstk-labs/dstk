import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
});
