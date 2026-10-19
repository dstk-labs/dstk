import type { Email } from "./emails.js";
import nodemailer from "nodemailer";
import { env } from "@/config/env.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
});

export async function sendEmail(to: string, { subject, html, text }: Email) {
  await transporter.sendMail({
    from: "no-reply@dstk.org",
    to,
    subject,
    html,
    text,
  });
}
