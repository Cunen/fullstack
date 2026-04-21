import js from "@eslint/js";
import json from "@eslint/json";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.json"],
    plugins: { json },
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.html"],
    rules: {
      "no-unused-expressions": "off",
    },
  },
]);
