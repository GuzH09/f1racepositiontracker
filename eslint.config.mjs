import globals from "globals";
import tseslint from "typescript-eslint";
import { fixupPluginRules } from "@eslint/compat";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import eslintPluginReactCompiler from "eslint-plugin-react-compiler";
import eslintPluginNext from "@next/eslint-plugin-next";

export default [
  // Ignores configuration
  {
    ignores: ["node_modules", ".next", "out", "coverage", ".idea"],
  },
  // General configuration
  // React configuration
  {
    plugins: {
      "react-compiler": fixupPluginRules(eslintPluginReactCompiler),
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/prop-types": "off",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-compiler/react-compiler": "error",
      "react/jsx-no-leaked-render": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/click-events-have-key-events": "off",
    },
  },
  // TypeScript configuration
  ...[
    ...tseslint.configs.recommended,
    {
      rules: {
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-shadow": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-confusing-void-expression": "off",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            args: "after-used",
            ignoreRestSiblings: false,
            argsIgnorePattern: "^_.*?$",
          },
        ],
      },
    },
  ],
  // Prettier configuration
  ...[
    eslintPluginPrettier,
    {
      rules: {
        "prettier/prettier": [
          "warn",
          {
            endOfLine: "auto",
            printWidth: 150,
            trailingComma: "all",
            tabWidth: 2,
            semi: true,
            singleQuote: true,
            useTabs: false,
            plugins: ["prettier-plugin-tailwindcss"],
          },
        ],
      },
    },
  ],
  // Import configuration
  {
    rules: {
      "import/no-default-export": "off",
    },
  },
  // Next configuration
  {
    plugins: {
      next: fixupPluginRules(eslintPluginNext),
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
];
