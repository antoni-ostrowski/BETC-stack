import { effectifyPromise } from "@packages/shared"
import { Effect } from "effect"

import { authedQuery } from "../lib"
import { appRuntime } from "../runtime"
import { runEffOrThrow } from "../utils_effect"

export const list = authedQuery
  .handler(async (ctx) => {
    const program = Effect.gen(function* () {
      return yield* effectifyPromise(() => ctx.db.query("todos").collect())
    })

    return runEffOrThrow(appRuntime, program)
  })
  .public()
