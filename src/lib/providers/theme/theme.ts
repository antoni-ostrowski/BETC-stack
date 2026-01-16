import { createServerFn } from "@tanstack/react-start"
import { getCookie, setCookie } from "@tanstack/react-start/server"
import { Schema } from "effect"

const postThemeValidator = Schema.standardSchemaV1(
  Schema.Union(Schema.Literal("light"), Schema.Literal("dark"))
)

export type T = Schema.Schema.Type<typeof postThemeValidator>

const storageKey = "_preferred-theme"

export const getThemeServerFn = createServerFn().handler(
  async () => (getCookie(storageKey) || "light") as T
)

export const setThemeServerFn = createServerFn({ method: "POST" })
  .inputValidator(postThemeValidator)
  .handler(async ({ data }) => setCookie(storageKey, data))
