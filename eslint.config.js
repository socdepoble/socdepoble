import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import unusedImports from "eslint-plugin-unused-imports";
import reactPlugin from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

const architectureGuardPlugin = {
  rules: {
    "no-core-imports": {
      create(context) {
        return {
          ImportDeclaration(node) {
            const importPath = node.source.value;
            const filePath = context.filename;
            if (filePath.includes('/src/components/') && (importPath.includes('@powersync') || importPath.includes('src/core/internals'))) {
               context.report({ node, message: "🛑 [ARCH SHIELD] UI Components cannot import internal core or powersync directly. Use DAL or facades." });
            }
          }
        };
      }
    },
    "no-unsafe-pwa": {
      create(context) {
        return {
          Property(node) {
            if (node.key && node.key.name === 'registerType' && node.value && node.value.value === 'autoUpdate') {
               context.report({ node, message: "🛑 [ARCH SHIELD] registerType MUST be 'prompt' for iOS safety." });
            }
          }
        };
      }
    }
  }
};

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
      "architecture-guard": architectureGuardPlugin,
    },
    rules: {
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": "off",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "architecture-guard/no-core-imports": "error",
      "architecture-guard/no-unsafe-pwa": "error",
      "no-restricted-syntax": [
        "error",
        {
          "selector": "JSXAttribute[name.name='style']",
          "message": "⛔ PROHIBIT: Estils inline. Usa CSS Modules o classes de Pedra Seca."
        },
        {
          "selector": "JSXAttribute[name.name='onClick'] CallExpression[callee.property.name='stopPropagation']",
          "message": "⛔ PROHIBIT: Events inline. Mou el handler al hook o component pare."
        }
      ],
    },
  },
]);
