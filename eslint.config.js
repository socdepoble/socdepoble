import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import unusedImports from "eslint-plugin-unused-imports";
import reactPlugin from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "dist/**",
    "dev-dist/**",
    "android/**",
    "ios/**",
    "node_modules/**",
    "public/assets/**",
    "public/sw.js",
    "test_*.js",
    "patch_*.js",
    "purge_*.js",
    "restore_*.js",
    "refactor_*.js",
    "check_data.cjs",
    "combine_presentation.mjs",
    "**/.DS_Store",
    "_HISTORIC_SENSIBLE/**",
    "_PAPERERA_OBSOLETA/**",
  ]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        process: "readonly",
        Buffer: "readonly",
        require: "readonly",
      },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      "unused-imports": unusedImports,
      "react": reactPlugin,
    },
    rules: {
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": "off",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
    },
  },
]);
