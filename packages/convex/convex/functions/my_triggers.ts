import { getHeaders } from "better-convex/auth"
import { customCtx, customMutation } from "convex-helpers/server/customFunctions"
import { Triggers } from "convex-helpers/server/triggers"
import { Effect } from "effect"

import { DataModel } from "./_generated/dataModel"
import {
  mutation as rawMutation,
  internalMutation as rawInternalMutation
} from "./_generated/server"
import { getAuth } from "./generated/auth"
import { appRuntime } from "./runtime"
import { effectifyPromise, runEffOrThrow } from "./utils_effect"

export const triggers = new Triggers<DataModel>()

triggers.register("user", async (ctx, change) => {
  if (change.operation === "insert") {
    const program = Effect.gen(function* () {
      const auth = getAuth(ctx)
      const org = yield* effectifyPromise(async () =>
        auth.api.createOrganization({
          body: {
            name: "personal-",
            slug: "personal"
          },
          headers: await getHeaders(ctx)
        })
      )
      return org
    })
    console.log("user changed TRIGGER RAN", change)
    await runEffOrThrow(appRuntime, program)
    return
  }
})

export const mutation = customMutation(rawMutation, customCtx(triggers.wrapDB))
export const internalMutation = customMutation(rawInternalMutation, customCtx(triggers.wrapDB))
