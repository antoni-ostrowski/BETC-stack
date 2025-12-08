import { authQuery } from "../lib"

export const getMe = authQuery({
  handler: (ctx) => {
    return {
      authInfo: ctx.auth.authUser,
      ...ctx.auth.user,
    }
  },
})
