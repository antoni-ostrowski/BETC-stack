//  @ts-check

/** @type {import('prettier').Config} */
const config = {
  semi: false,
  singleQuote: false,
  trailingComma: "all",
  plugins: ["prettier-plugin-organize-imports", "@prettier/plugin-oxc"],
};

export default config;
