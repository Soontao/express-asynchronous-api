import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      semi: "error",
      "no-extra-semi": "off",
      "no-var": "error",
    },
    ignores: ["node_modules", "lib"],
  },
];
