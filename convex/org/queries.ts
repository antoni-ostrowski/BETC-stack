import { Effect } from "effect"
import { authedQuery } from "../lib"
import { appRuntime } from "../runtime"
import { DatabaseError, effectifyPromise, runEffOrThrow } from "../utils_effect"

export const list = authedQuery
  .handler(async (ctx) => {
    const program = Effect.gen(function* () {
      const { auth, headers } = yield* ctx.getAuth
      return yield* effectifyPromise(
        () =>
          auth.api.listOrganizations({
            headers
          }),
        (a) => new DatabaseError(a)
      )
    })

    return runEffOrThrow(appRuntime, program)
  })
  .public()
