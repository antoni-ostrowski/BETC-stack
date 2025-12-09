import { query } from "../_generated/server"
import { authComponent } from "../auth"
import { authQuery } from "../lib"

export const getMe = authQuery({
  handler: (ctx) => {
    return {
      authInfo: ctx.auth.authUser,
      ...ctx.auth.user,
    }
  },
})

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx)
  },
})
