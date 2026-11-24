import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-config-prettier/flat";

const __dirname = dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({ baseDirectory: __dirname });

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts"],
  },

  // Next.js recommended + Core Web Vitals + TypeScript rules
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    rules: {
      // Allow intentionally unused vars/args when prefixed with "_"
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      // Use `import type` for type-only imports (auto-fixable)
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "import/no-duplicates": ["error", { "prefer-inline": true }],
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"], "type"],
          pathGroups: [{ pattern: "@/**", group: "internal" }],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "react/self-closing-comp": "warn",
      "react/jsx-curly-brace-presence": ["warn", { props: "never", children: "never" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "smart"],
      "prefer-const": "error",
    },
  },

  // Must be last: turns off stylistic rules that conflict with Prettier
  prettier,
];

export default eslintConfig;
