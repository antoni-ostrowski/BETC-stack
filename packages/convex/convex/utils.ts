import { getHeaders } from "better-convex/auth"
import { GenericQueryCtx } from "convex/server"
import { ConvexError } from "convex/values"
import { Exit, Match, pipe } from "effect"
import { Effect, ManagedRuntime, Result } from "effect"

import { Unauthenticated, ServerError } from "./errors"
import { DataModel, Id } from "./functions/_generated/dataModel"
import { getAuth } from "./functions/generated/auth"
import { GenericCtx } from "./functions/generated/server"

export async function runEffOrThrow<A, E, R>(
  runtime: ManagedRuntime.ManagedRuntime<R, never>,
  eff: Effect.Effect<A, E, R>
): Promise<A> {
  const exit = await runtime.runPromise(Effect.exit(eff))

  if (Exit.isFailure(exit)) {
    const error = exit.cause

    runtime.runSync(Effect.logError("Effect failed", error))

    throw new ConvexError(JSON.stringify(error))
  }

  return exit.value
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
    return yield* new Unauthenticated()
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

export function parseConvexError(error: unknown) {
  const errMess =
    error instanceof ConvexError
      ? (error.data as string)
      : `[ERROR] Unexpected error occurred - ${error}`
  return errMess
}

export function parseConvexErrorData(error: unknown) {
  const errMess = error instanceof ConvexError ? error.data : { _tag: "Unknown error occurred" }
  return errMess
}

export function parseQueryError<ErrorT>(error: Error) {
  const err: ErrorT = parseConvexErrorData(error)
  return Match.value(err)
}

export const isAuthError = (error: unknown) => {
  const message =
    (error instanceof ConvexError && error.data) || (error instanceof Error && error.message) || ""
  return /auth/i.test(message)
}

export function getCurrentUnixTimestamp(): number {
  return Math.floor(Date.now() / 1000)
}

type Success<T> = [T, null]
type Failure<E> = [null, E]
type Result<T, E = Error> = Success<T> | Failure<E>

export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  try {
    const data = await promise
    return [data, null]
  } catch (error) {
    return [null, error as E]
  }
}

export function tryCatchSync<T, E = Error>(func: () => T): Result<T, E> {
  try {
    const data = func()
    return [data, null]
  } catch (error) {
    return [null, error as E]
  }
}

/**
 * Creates an Effect from a Promise, handling errors and logging.
 *
 * @template A - The success type of the promise.
 * @template E - The custom error type to throw on promise rejection.
 * @template R - The context/environment required by the promise factory (if any).
 * @param {() => Promise<A>} promiseFactory - A function that returns the Promise to be wrapped.
 * @param {(cause: unknown, message: string) => E} errorFactory - A function to map the unknown promise rejection cause to your specific error type E.
 * @param {string} [errorMessage] - An optional custom error message. Defaults to "Promise failed".
 * @returns {Effect.Effect<A, E, R>} An Effect that resolves to the promise's success value, or your custom error E.
 */
export function effectifyPromise<A, E, R = never>(
  promiseFactory: () => Promise<A>,
  errorFactory: (obj: { cause: unknown; message: string }) => E = (a) => new ServerError(a) as E,
  errorMessage: string = "Promise failed"
): Effect.Effect<A, E, R> {
  return pipe(
    Effect.tryPromise({
      try: promiseFactory,
      catch: (cause) => errorFactory({ cause, message: errorMessage })
    }),
    Effect.tapError((error) => Effect.logError("Effectified Promise Error:", errorMessage, error))
  )
}
