import { authQuery } from "../lib"

export const getMe = authQuery({
  handler: (ctx) => {
    return {
      ...ctx.auth.user
    }
  }
})
