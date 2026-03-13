import { Effect } from "effect"
import { z } from "zod/v4"
import { authedMutation } from "../lib"
import { appRuntime } from "../runtime"
import {
  DatabaseError,
  effectifyPromise,
  runEffOrThrow,
  ServerError
} from "../utils_effect"
function generateSlug(name: string) {
  return name.slice(0, name.length / 2)
}

export const create = authedMutation
  .input(
    z.object({
      name: z.string()
    })
  )
  .handler(async (ctx, args) => {
    const program = Effect.gen(function* () {
      const { auth, headers } = yield* ctx.getAuth
      const org = yield* effectifyPromise(
        async () =>
          auth.api.createOrganization({
            body: {
              name: args.name,
              slug: generateSlug(args.name),
              keepCurrentActiveOrganization: false
            },
            headers
          }),
        (a) => new DatabaseError(a)
      )
      if (!org) {
        return yield* new ServerError({
          message: "failed to create organization"
        })
      }

      yield* effectifyPromise(
        () => markOrgAsActive(ctx, { orgId: org?.id }),
        (a) => new ServerError(a)
      )
      return org
    })

    return await runEffOrThrow(appRuntime, program)
  })
  .public()

export const markOrgAsActive = authedMutation
  .input(z.object({ orgId: z.string() }))
  .handler(async (ctx, args) => {
    const program = Effect.gen(function* () {
      const { auth, headers } = yield* ctx.getAuth
      const org = yield* effectifyPromise(
        async () =>
          auth.api.setActiveOrganization({
            body: {
              organizationId: args.orgId
            },
            headers
          }),
        (a) => new DatabaseError(a)
      )
      return org
    })

    return await runEffOrThrow(appRuntime, program)
  })

export const markAsActive = markOrgAsActive.public()
