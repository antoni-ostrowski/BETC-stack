import { Infer, v } from "convex/values"
import { authVv } from "../betterAuth/schema"
import { authQuery, vv } from "../lib"

const user = v.object({
  authInfo: v.object({ ...authVv.doc("user").fields }),
  ...vv.doc("users").fields,
})

export type User = Infer<typeof user>

export const getMe = authQuery({
  handler: (ctx) => {
    return {
      authInfo: ctx.auth.authUser,
      ...ctx.auth.user,
    }
  },
})
