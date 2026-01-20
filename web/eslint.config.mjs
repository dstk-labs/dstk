import antfu from "@antfu/eslint-config";

export default antfu({
  type: "app",
  typescript: true,
  react: true,
  formatters: true,
  stylistic: {
    indent: 2,
    semi: true,
    quotes: "double",
  },
  ignores: ["./src/graphql/*.ts"],
}, {
  rules: {
    "ts/consistent-type-definitions": ["error", "type"],
    "no-console": ["warn"],
    "node/prefer-global/process": ["off"],
    "node/prefer-global/buffer": ["off"],
    "antfu/no-top-level-await": ["off"],
    "no-new": ["off"],
    "react/no-clone-element": ["off"],
    "react-hooks-extra/no-direct-set-state-in-use-effect": ["off"],
    "perfectionist/sort-imports": ["error"],
  },
});
