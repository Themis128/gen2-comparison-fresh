import next from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";

export default [...next, ...nextCoreWebVitals, ...nextTypescript, {
  ignores: [
    ".next/**",
    ".amplify/**",
    "node_modules/**",
    "playwright-report/**",
    "test-results/**",
    "amplify/**",
    "coverage/**",
    "next-env.d.ts",
    "*.config.js",
    "*.config.mjs",
    "*.config.ts",
    "public/**",
  ],
}, js.configs.recommended, {
  files: ["**/*.ts", "**/*.tsx"],
  languageOptions: {
    parser: tsparser,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    globals: {
      window: "readonly",
      document: "readonly",
      navigator: "readonly",
      localStorage: "readonly",
      sessionStorage: "readonly",
      fetch: "readonly",
      Request: "readonly",
      Response: "readonly",
      Headers: "readonly",
      FormData: "readonly",
      URL: "readonly",
      URLSearchParams: "readonly",
      console: "readonly",
      setTimeout: "readonly",
      clearTimeout: "readonly",
      setInterval: "readonly",
      clearInterval: "readonly",
      requestAnimationFrame: "readonly",
      cancelAnimationFrame: "readonly",
      alert: "readonly",
      confirm: "readonly",
      prompt: "readonly",
      Image: "readonly",
      HTMLElement: "readonly",
      HTMLDivElement: "readonly",
      HTMLInputElement: "readonly",
      HTMLButtonElement: "readonly",
      Event: "readonly",
      MouseEvent: "readonly",
      KeyboardEvent: "readonly",
      ResizeObserver: "readonly",
      IntersectionObserver: "readonly",
      MutationObserver: "readonly",
      process: "readonly",
      global: "readonly",
      Buffer: "readonly",
      __dirname: "readonly",
      __filename: "readonly",
      React: "readonly",
      JSX: "readonly",
      jest: "readonly",
      describe: "readonly",
      it: "readonly",
      test: "readonly",
      expect: "readonly",
      beforeEach: "readonly",
      afterEach: "readonly",
      beforeAll: "readonly",
      afterAll: "readonly",
    },
  },
  plugins: {
    "@typescript-eslint": tseslint,
    "react": reactPlugin,
    "react-hooks": reactHooksPlugin,
    "jsx-a11y": jsxA11yPlugin,
    "import": importPlugin,
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    ...tseslint.configs.recommended.rules,
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { 
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      caughtErrorsIgnorePattern: "^_"
    }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/consistent-type-imports": ["warn", {
      prefer: "type-imports",
      fixStyle: "inline-type-imports"
    }],
    "@typescript-eslint/no-import-type-side-effects": "error",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/jsx-no-target-blank": "error",
    "react/jsx-curly-brace-presence": ["warn", { props: "never", children: "never" }],
    "react/self-closing-comp": "warn",
    "react/jsx-boolean-value": ["warn", "never"],
    "react/no-array-index-key": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "jsx-a11y/alt-text": "warn",
    "jsx-a11y/anchor-is-valid": "warn",
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/no-static-element-interactions": "warn",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-role": "error",
    "import/order": ["warn", {
      "groups": [
        "builtin",
        "external",
        "internal",
        ["parent", "sibling"],
        "index",
        "type"
      ],
      "pathGroups": [
        {
          "pattern": "react",
          "group": "external",
          "position": "before"
        },
        {
          "pattern": "next/**",
          "group": "external",
          "position": "before"
        },
        {
          "pattern": "@/**",
          "group": "internal",
          "position": "before"
        }
      ],
      "pathGroupsExcludedImportTypes": ["react"],
      "newlines-between": "always",
      "alphabetize": {
        "order": "asc",
        "caseInsensitive": true
      }
    }],
    "import/no-duplicates": "error",
    "import/no-unresolved": "off",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "prefer-const": "warn",
    "no-var": "error",
    "eqeqeq": ["error", "always", { null: "ignore" }],
  },
}, {
  files: ["**/*.js", "**/*.mjs"],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    globals: {
      process: "readonly",
      global: "readonly",
      Buffer: "readonly",
      __dirname: "readonly",
      __filename: "readonly",
      module: "readonly",
      require: "readonly",
      exports: "readonly",
    },
  },
}, {
  files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "no-console": "off",
  },
}];
