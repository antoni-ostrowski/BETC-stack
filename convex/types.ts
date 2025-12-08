import { Infer, v } from "convex/values"
import { authVv } from "./betterAuth/schema"
import { vv } from "./lib"

const user = vv.object({
  authInfo: v.object({ ...authVv.doc("user").fields }),
  ...vv.doc("users").fields,
})

export type MyUser = Infer<typeof user>
