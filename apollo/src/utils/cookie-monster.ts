import type { Context } from "@/builder.js";
import { AccountError } from "./errors.js";

type HandleAuthCookiesArgs = {
  headers: Headers;
  ctx: Context;
};

export async function handleAuthCookies({ headers, ctx }: HandleAuthCookiesArgs): Promise<void> {
  const cookies = headers.getSetCookie();
  if (cookies.length === 0) {
    throw new AccountError({ name: "FAILED_TO_CREATE_SESSION" });
  }

  ctx.res.set("Set-Cookie", cookies);
}
