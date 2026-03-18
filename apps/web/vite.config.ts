import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite-plus";

const baseIgnorePatters = [
  "**/node_modules/**",
  "**/.convex/_generated/**",
  "**/.convex/betterAuth/_generated/**",
  "**/routeTree.gen.ts",
  "**/bun.lock",
];

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    nitro({ preset: "node" }),
    devtools({ consolePiping: { enabled: true }, enhancedLogs: { enabled: true } }),
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],

  lint: {
    ignorePatterns: [...baseIgnorePatters],
    plugins: [
      "react",
      "typescript",
      "unicorn",
      "import",
      "node",
      "promise",
      "react-perf",
      "jsx-a11y",
    ],
    env: {
      builtin: true,
    },
    rules: {
      "react-hooks/exhaustive-deps": "warn",
      "no-unused-vars": "warn",
      "@typescript-eslint/no-confusing-void-expression": "warn",
      "@typescript-eslint/no-misused-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/only-throw-error": "warn",
      "@typescript-eslint/require-await": "warn",
      "@typescript-eslint/restrict-template-expressions": "warn",
      "require-yield": "off",
      "@typescript-eslint/unbound-method": "off",
    },
  },
  fmt: {
    singleQuote: false,
    semi: false,
    trailingComma: "none",
    ignorePatterns: [...baseIgnorePatters],
    sortImports: {
      groups: [
        "builtin",
        "external",
        ["internal", "subpath"],
        ["parent", "sibling", "index"],
        "style",
        "unknown",
      ],
      newlinesBetween: true,
      order: "asc",
      internalPattern: ["^~/", "^@/"],
    },
    sortTailwindcss: {
      functions: ["clsx", "cn", "cva", "tw"],
    },
    sortPackageJson: {
      sortScripts: false,
    },
  },
});
