import type { PasswordRule } from "@/features/auth/components/PasswordStrength";
import { z } from "zod/v4";

export const passwordRules = [
  {
    message: "At least 12 characters",
    name: "length",
    test: (val: string) => val.length >= 12,
  },
  {
    message: "One lowercase letter",
    name: "lowercase",
    test: (val: string) => /[a-z]/.test(val),
  },
  {
    message: "One uppercase letter",
    name: "uppercase",
    test: (val: string) => /[A-Z]/.test(val),
  },
  {
    message: "One number",
    name: "number",
    test: (val: string) => /\d/.test(val),
  },
  {
    message: "One special character",
    name: "symbol",
    test: (val: string) => /[^A-Z0-9]/i.test(val),
  },
] as const satisfies readonly PasswordRule[];

export const passwordSchema = passwordRules.reduce(
  (schema, rule) =>
    schema.refine(rule.test, {
      message: rule.message,
    }),
  z.string(),
);
