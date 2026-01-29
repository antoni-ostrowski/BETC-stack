import { defineEnt, defineEntSchema, getEntDefinitions } from "convex-ents"
import { zodOutputToConvex } from "convex-helpers/server/zod4"
import z from "zod"

export const userZod = z.object({
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  image: z.string().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
  role: z.string().optional(),
  banned: z.boolean().optional(),
  banReason: z.string().optional(),
  banExpires: z.number().optional()
})

export const sessionZod = z.object({
  token: z.string(),
  expiresAt: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  impersonatedBy: z.string().optional()
})

export const accountZod = z.object({
  accountId: z.string(),
  providerId: z.string(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  idToken: z.string().optional(),
  accessTokenExpiresAt: z.number().optional(),
  refreshTokenExpiresAt: z.number().optional(),
  scope: z.string().optional(),
  password: z.string().optional(),
  createdAt: z.number(),
  updatedAt: z.number()
})

export const verificationZod = z.object({
  identifier: z.string(),
  value: z.string(),
  expiresAt: z.number(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional()
})

export const jwksZod = z.object({
  publicKey: z.string(),
  privateKey: z.string(),
  createdAt: z.number()
})

export const todoZod = z.object({
  text: z.string(),
  completed: z.boolean()
})

const schema = defineEntSchema({
  user: defineEnt(zodOutputToConvex(userZod))
    .index("email", ["email"])
    .edges("sessions", { to: "session", ref: "userId" })
    .edges("accounts", { to: "account", ref: "userId" })
    .edges("todos", { to: "todo", ref: "userId" }),

  session: defineEnt(zodOutputToConvex(sessionZod))
    .index("token", ["token"])
    .edge("user", { to: "user", field: "userId" }),

  account: defineEnt(zodOutputToConvex(accountZod))
    .index("accountId", ["accountId"])
    .edge("user", { to: "user", field: "userId" }),

  verification: defineEnt(zodOutputToConvex(verificationZod)).index(
    "identifier",
    ["identifier"]
  ),

  jwks: defineEnt(zodOutputToConvex(jwksZod)),

  todo: defineEnt(zodOutputToConvex(todoZod)).edge("user", {
    to: "user",
    field: "userId"
  })
})

export type User = z.infer<typeof userZod>
export type Session = z.infer<typeof sessionZod>
export type Account = z.infer<typeof accountZod>
export type Verification = z.infer<typeof verificationZod>
export type Jwks = z.infer<typeof jwksZod>
export type Todo = z.infer<typeof todoZod>

export default schema
export const entDefinitions = getEntDefinitions(schema)
