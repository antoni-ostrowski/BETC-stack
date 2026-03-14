import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    ignorePatterns: [
      "**/node_modules/**",
      "**/convex/_generated/**",
      "**/convex/betterAuth/_generated/**",
      "**/bun.lock",
    ],
    plugins: ["typescript"],
    categories: {
      correctness: "error",
      suspicious: "warn",
      perf: "warn",
    },
    rules: {
      "no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  fmt: {
    singleQuote: false,
    semi: false,
    trailingComma: "none",
    ignorePatterns: [
      "**/node_modules/**",
      "**/.convex/_generated/**",
      "**/.convex/betterAuth/_generated/**",
      "**/bun.lock",
    ],
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
    sortPackageJson: {
      sortScripts: false,
    },
  },
});
