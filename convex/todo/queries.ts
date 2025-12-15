import { Effect } from "effect"
import { query } from "../_generated/server"
import { appRuntime, matchExit } from "../utils_effect"
import { TodoApi } from "./api"

export const list = query({
  handler: async (ctx) => {
    const result = await appRuntime.runPromiseExit(
      Effect.gen(function* () {
        const todoApi = yield* TodoApi
        return yield* todoApi.listTodos({ db: ctx.db })
      }).pipe(
        Effect.tapError((err) => Effect.logError(err)),
        Effect.tap((a) => Effect.logInfo(a))
      )
    )

    return await matchExit(result)
  }
})
