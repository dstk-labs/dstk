import type { DstkRole } from "@/db/db.js";
import { builder } from "@/builder.js";

const roles = ["owner", "member", "viewer"] as const satisfies readonly DstkRole[];

export const UserRole = builder.enumType("UserRole", {
  values: roles,
});
