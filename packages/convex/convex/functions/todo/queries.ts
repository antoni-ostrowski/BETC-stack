import { Effect } from "effect"

import { authedQuery } from "../lib"
import { appRuntime } from "../runtime"
import { DatabaseError, effectifyPromise, getUserFromCtx, runEffOrThrow } from "../utils_effect"

export const list = authedQuery
  .handler(async (ctx) => {
    const program = Effect.gen(function* () {
      const user = yield* getUserFromCtx(ctx, ctx.userId)
      return yield* effectifyPromise(
        () => ctx.db.query("todos").collect(),
        (a) => new DatabaseError(a)
      )
    })

    return runEffOrThrow(appRuntime, program)
  })
  .public()
