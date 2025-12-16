import { ConvexError } from "convex/values"
import { Data, Effect, Either, Layer, ManagedRuntime } from "effect"
import { TodoApi } from "./todo/api"

const appLayer = Layer.mergeAll(TodoApi.Default)

export const appRuntime = ManagedRuntime.make(appLayer)

/**
 * execute the final eff that returns the success data or wraps the failure in ConvexError,
 * (so client can easly read err message via parseConvexError util)
 * R = The requirements provided by the ManagedRuntime
 * E_Runtime = Errors that can occur during runtime initialization
 */
export async function runEffOrThrow<A, E, R, E_Runtime>(
  runtime: ManagedRuntime.ManagedRuntime<R, E_Runtime>,
  eff: Effect.Effect<A, E, R>
): Promise<A> {
  const result = await runtime.runPromise(Effect.either(eff))

  if (Either.isLeft(result)) {
    const error = result.left
    const errorMessage =
      (error as Error).message ||
      (typeof error === "string" ? error : "An unexpected error occurred")

    Effect.runSync(Effect.logError(error))

    throw new ConvexError(errorMessage)
  }

  return result.right
}

export class DatabaseError extends Data.TaggedError("DatabaseError")<{
  message?: string
}> {
  constructor(args?: { message?: string }) {
    super({
      message: args?.message ?? "Database error"
    })
  }
}

export class NotFound extends Data.TaggedError("NotFound")<{
  message?: string
}> {
  constructor(args?: { message?: string }) {
    super({
      message: args?.message ?? "Entity not found"
    })
  }
}
