import { getHeaders } from "better-convex/auth"
import { Effect } from "effect"
import { WithZod } from "fluent-convex/zod"
import z from "zod"

import { getAuth } from "../generated/auth"
import { mutation, withTriggers } from "../lib"
import { appRuntime } from "../runtime"
import { effectifyPromise, runEffOrThrow } from "../utils_effect"

export const setupNewUser = mutation
  .extend(WithZod)
  .use(withTriggers)
  .input(z.object({ name: z.string() }))
  .handler(async (ctx, args) => {
    const program = Effect.gen(function* () {
      const auth = getAuth(ctx)
      effectifyPromise(async () =>
        auth.api.createOrganization({
          body: {
            slug: "prsl" + args.name,
            name: "personal" + args.name
          },
          headers: await getHeaders(ctx)
        })
      )
    })
    await runEffOrThrow(appRuntime, program)
  })
  .internal()
