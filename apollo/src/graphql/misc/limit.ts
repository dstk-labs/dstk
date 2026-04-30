import type { Limit } from "@/types/limit.js";
import { builder } from "@/builder.js";
import { LIMITS } from "@/types/limit.js";
import { InputError } from "@/utils/errors.js";

builder.scalarType("Limit", {
  serialize: n => n,
  parseValue: (n: unknown) => {
    if (typeof n === "number" && LIMITS.includes(n)) {
      return n as Limit;
    }

    throw new InputError({ name: "INVALID_LIMIT_ERROR" });
  },
  description: "Valid page sizes are 10, 25, and 50 records",
});
