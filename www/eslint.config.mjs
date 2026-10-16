import antfu from "@antfu/eslint-config";

export default antfu({
  type: "app",
  typescript: true,
  astro: true,
  formatters: true,
  stylistic: {
    indent: 2,
    semi: true,
    quotes: "double",
  },
  ignores: ["dist", ".astro"],
}, {
  rules: {
    "ts/consistent-type-definitions": ["error", "type"],
    "perfectionist/sort-imports": ["error"],
  },
});
