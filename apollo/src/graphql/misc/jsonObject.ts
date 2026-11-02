import type { JsonObject } from "@/db/db.js";
import { builder } from "@/builder.js";
import { InputError } from "@/utils/errors.js";

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

builder.scalarType("JSONObject", {
  serialize: value => value,
  parseValue: (value: unknown) => {
    if (isJsonObject(value)) {
      return value;
    }

    throw new InputError({ name: "INVALID_JSON_OBJECT_ERROR" });
  },
  description: "A JSON object, such as the framework and parameters recorded for a model version",
});
