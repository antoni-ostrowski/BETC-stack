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
    experimentalSortImports: {
      groups: [
        ["type-import"],
        ["type-external", "value-external"],
        ["type-parent", "type-sibling", "type-index"],
        ["type-internal"],
        ["value-parent", "value-sibling", "value-index"],
        ["value-internal"],
      ],
      newlinesBetween: true,
    },
  },
});
