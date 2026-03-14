import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    ignorePatterns: [
      "**/node_modules/**",
      "**/.convex/_generated/**",
      "**/.convex/betterAuth/_generated/**",
      "**/bun.lock",
    ],
    plugins: ["react", "typescript", "unicorn"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
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
    overrides: [
      {
        files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
        rules: {
          "no-class-assign": "off",
          "no-const-assign": "off",
          "no-dupe-class-members": "off",
          "no-dupe-keys": "off",
          "no-func-assign": "off",
          "no-import-assign": "off",
          "no-new-native-nonconstructor": "off",
          "no-obj-calls": "off",
          "no-redeclare": "off",
          "no-setter-return": "off",
          "no-this-before-super": "off",
          "no-unsafe-negation": "off",
          "no-with": "off",
        },
      },
    ],
  },
  fmt: {
    singleQuote: false,
    semi: false,
    trailingComma: "none",
    ignorePatterns: [
      "**/node_modules/**",
      "**/.convex/_generated/**",
      "**/.convex/betterAuth/_generated/**",
      "**/routeTree.gen.ts",
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
    sortTailwindcss: {
      functions: ["clsx", "cn", "cva", "tw"],
    },
    sortPackageJson: {
      sortScripts: false,
    },
  },
});
