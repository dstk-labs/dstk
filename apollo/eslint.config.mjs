import antfu from "@antfu/eslint-config";

export default antfu({
  type: "app",
  typescript: true,
  formatters: true,
  stylistic: {
    indent: 2,
    semi: true,
    quotes: "double",
  },
  ignores: ["./src/db/db.d.ts"],
}, {
  rules: {
    "ts/consistent-type-definitions": ["error", "type"],
    "no-console": ["warn"],
    "node/prefer-global/process": ["off"],
    "node/prefer-global/buffer": ["off"],
    "antfu/no-top-level-await": ["off"],
    "no-new": ["off"],
    "perfectionist/sort-imports": ["error"],
  },
});
