import { Effect } from "effect"

import { DatabaseError } from "../errors"
import { authedQuery } from "../lib"
import { appRuntime } from "../runtime"
import { effectifyPromise, runEffOrThrow } from "../utils_effect"

export const list = authedQuery
  .handler(async (ctx) => {
    const program = Effect.gen(function* () {
      return yield* effectifyPromise(
        () => ctx.db.query("todos").collect(),
        (a) => new DatabaseError(a)
      )
    })

    return runEffOrThrow(appRuntime, program)
  })
  .public()
