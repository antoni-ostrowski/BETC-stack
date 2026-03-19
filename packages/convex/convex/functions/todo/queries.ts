import { Effect } from "effect"

import { effectifyPromise, runEffOrThrow } from "../../utils"
import { authedQuery } from "../lib"
import { appRuntime } from "../runtime"

export const list = authedQuery
  .handler(async (ctx) => {
    const program = Effect.gen(function* () {
      return yield* effectifyPromise(() => ctx.db.query("todos").collect())
    })

    return runEffOrThrow(appRuntime, program)
  })
  .public()
