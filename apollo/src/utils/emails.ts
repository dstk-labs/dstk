import { env } from "@/config/env.js";

export type Email = {
  subject: string;
  html: string;
  text: string;
};

// Email clients ignore CSS variables, so these mirror @dstk/design-tokens by value
const COLORS = {
  background: "#0e1117",
  card: "#161b22",
  inset: "#1c2129",
  border: "#30363d",
  text: "#e6edf3",
  textSecondary: "#9eaab8",
  textMuted: "#6b7685",
  button: "#4ba8d1",
  buttonText: "#0e1117",
  link: "#87ceeb",
};

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const FONT_MONO = "'SF Mono', 'Fira Code', 'Cascadia Code', monospace";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function paragraph(html: string) {
  return `<p style="margin: 0 0 16px; color: ${COLORS.textSecondary}; font-size: 14px; line-height: 1.6;">${html}</p>`;
}

function button(href: string, label: string) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 24px auto;">
      <tr>
        <td style="background: ${COLORS.button}; border-radius: 9999px;">
          <a href="${escapeHtml(href)}" style="display: inline-block; padding: 12px 28px; color: ${COLORS.buttonText}; font-size: 15px; letter-spacing: 0.2px; text-decoration: none;">${escapeHtml(label)}</a>
        </td>
      </tr>
    </table>
    <p style="margin: 0 0 16px; color: ${COLORS.textMuted}; font-size: 12px; line-height: 1.6;">
      Or paste this link into your browser:<br>
      <a href="${escapeHtml(href)}" style="color: ${COLORS.link}; word-break: break-all;">${escapeHtml(href)}</a>
    </p>`;
}

function code(value: string) {
  return `
    <div style="margin: 24px 0; padding: 16px; background: ${COLORS.inset}; border: 1px solid ${COLORS.border}; border-radius: 10px; text-align: center; color: ${COLORS.text}; font-family: ${FONT_MONO}; font-size: 28px; letter-spacing: 6px;">
      ${escapeHtml(value)}
    </div>`;
}

function layout({ title, body, footer }: { title: string; body: string; footer: string }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="dark">
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin: 0; padding: 0; background: ${COLORS.background}; font-family: ${FONT};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: ${COLORS.background};">
      <tr>
        <td align="center" style="padding: 40px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px;">
            <tr>
              <td align="center" style="padding-bottom: 24px;">
                <img src="${env.APP_URL}/images/dstkLogoInverted.png" width="40" alt="DSTK" style="display: block; border: 0;">
              </td>
            </tr>
            <tr>
              <td style="padding: 32px; background: ${COLORS.card}; border: 1px solid ${COLORS.border}; border-radius: 16px;">
                <h1 style="margin: 0 0 16px; color: ${COLORS.text}; font-size: 24px; font-weight: 300; letter-spacing: 0.2px; line-height: 1.3;">${escapeHtml(title)}</h1>
                ${body}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top: 24px; color: ${COLORS.textMuted}; font-size: 12px; line-height: 1.6;">
                ${escapeHtml(footer)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function passwordResetEmail(link: string): Email {
  const title = "Reset your password";
  const message = "We got a request to reset the password for your DSTK account. The link works for 1 hour.";
  const footer = "If you didn't ask to reset your password, you can ignore this email. Your password stays the same.";

  return {
    subject: "DSTK | Reset your password",
    html: layout({ title, body: paragraph(escapeHtml(message)) + button(link, "Reset password"), footer }),
    text: `${title}\n\n${message}\n\n${link}\n\n${footer}`,
  };
}

export function verificationEmail(link: string): Email {
  const title = "Verify your email";
  const message = "Confirm your email address to finish setting up your DSTK account.";
  const footer = "If you didn't create a DSTK account, you can ignore this email.";

  return {
    subject: "DSTK | Verify your email",
    html: layout({ title, body: paragraph(escapeHtml(message)) + button(link, "Verify email"), footer }),
    text: `${title}\n\n${message}\n\n${link}\n\n${footer}`,
  };
}

export function signInCodeEmail(otp: string, minutes: number): Email {
  const title = "Your sign-in code";
  const message = `Enter this code to finish signing in. It expires in ${minutes} minutes.`;
  const footer = "If you didn't try to sign in, change your password. Someone else may know it.";

  return {
    subject: "DSTK | Your sign-in code",
    html: layout({ title, body: paragraph(escapeHtml(message)) + code(otp), footer }),
    text: `${title}\n\n${message}\n\n${otp}\n\n${footer}`,
  };
}

export function invitationEmail({ inviterName, link, role, teamName }: {
  inviterName: string;
  link: string;
  role: string;
  teamName: string;
}): Email {
  const title = `Join ${teamName}`;
  const message = `${inviterName} invited you to join ${teamName} as a ${role}. The invitation expires in 48 hours.`;
  const messageHtml = `${escapeHtml(inviterName)} invited you to join <span style="color: ${COLORS.text};">${escapeHtml(teamName)}</span> as a ${escapeHtml(role)}. The invitation expires in 48 hours.`;
  const footer = "If you weren't expecting this invitation, you can ignore this email.";

  return {
    subject: `DSTK | ${inviterName} invited you to ${teamName}`,
    html: layout({ title, body: paragraph(messageHtml) + button(link, "View invitation"), footer }),
    text: `${title}\n\n${message}\n\n${link}\n\n${footer}`,
  };
}
