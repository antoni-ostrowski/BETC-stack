/** @type {import('prettier').Config} */
const config = {
  semi: false,
  singleQuote: false,
  trailingComma: "all",
  plugins: ["@prettier/plugin-oxc", "prettier-plugin-organize-imports"],
}

export default config
