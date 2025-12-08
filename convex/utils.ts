import { ConvexError } from "convex/values"
import { Cause, Data, Effect, Exit, Layer, ManagedRuntime } from "effect"
import { TodoApi } from "./todo/api"

const appLayer = Layer.mergeAll(TodoApi.Default)

export const appRuntime = ManagedRuntime.make(appLayer)

export async function matchExit<A, E>(effect: Effect.Effect<A, E>): Promise<A> {
  const resultPromise = await appRuntime.runPromiseExit(effect)

  return Exit.match(resultPromise, {
    onFailure: (cause) => {
      throw new ConvexError(Cause.pretty(cause))
    },
    onSuccess: (value) => {
      return value
    },
  })
}

export class DatabaseError extends Data.TaggedError("DatabaseError")<{
  message: string
}> {}

export class NotFound extends Data.TaggedError("NotFound")<{
  message: string
}> {}
