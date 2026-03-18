import { effectifyPromise } from "@packages/shared"
import { getHeaders } from "better-convex/auth"
import { GenericQueryCtx } from "convex/server"
import { ConvexError } from "convex/values"
import { Effect, ManagedRuntime, Result } from "effect"

import { DataModel, Id } from "./_generated/dataModel"
import { NotAuthenticated, ServerError } from "./errors"
import { getAuth } from "./generated/auth"
import { GenericCtx } from "./generated/server"

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
  const result = await runtime.runPromise(Effect.result(eff))

  if (Result.isFailure(result)) {
    const error = result.failure
    const errorMessage =
      (error as Error).message ||
      (typeof error === "string" ? error : "An unexpected error occurred")

    Effect.runSync(Effect.logError(error))

    throw new ConvexError(errorMessage)
  }

  return result.success
}

export const getUserById = Effect.fn(function* (
  ctx: GenericQueryCtx<DataModel>,
  userId: Id<"user">
) {
  const user = yield* effectifyPromise(
    () => ctx.db.get("user", userId),
    (a) => new ServerError(a)
  )
  if (!user) {
    return yield* new NotAuthenticated()
  }
  return user
})

export const getUserAuth = Effect.fn(function* (ctx: GenericQueryCtx<DataModel>) {
  const c: GenericCtx = ctx
  return yield* effectifyPromise(
    async () => {
      return { auth: getAuth(c), headers: await getHeaders(ctx) }
    },
    (a) => new ServerError(a)
  )
})
