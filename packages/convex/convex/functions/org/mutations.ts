import { Effect } from "effect"
import { z } from "zod/v4"

import { DatabaseError, ServerError } from "../../errors"
import { getUserAuth, getUserById, runEffOrThrow, effectifyPromise } from "../../utils"
import { Id } from "../_generated/dataModel"
import { authedMutation, mutation } from "../lib"
import { appRuntime } from "../runtime"

export const generateSlug = (input: string): string => {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD") // Splits accents from letters (e.g., "é" -> "e")
    .replace(/[\u0300-\u036f]/g, "") // Removes the accents
    .replace(/[^a-z0-9\s-]/g, "") // Removes anything that isn't a letter, number, or space
    .replace(/[\s-]+/g, "-") // Replaces spaces and multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, "") // Trims hyphens from the start and end
}

export const create = mutation
  .input(
    z.object({
      name: z.string(),
      slug: z.string()
    })
  )
  .handler(async (ctx, args) => {
    const program = Effect.gen(function* () {
      const { auth, headers } = yield* getUserAuth(ctx)

      const org = yield* effectifyPromise(
        async () =>
          auth.api.createOrganization({
            body: {
              name: args.name,
              slug: args.slug,
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
        () => markAsActiveFn(ctx, { orgId: org?.id }),
        (a) => new ServerError(a)
      )
      return org
    })

    return await runEffOrThrow(appRuntime, program)
  })
  .public()

export const markAsActiveFn = mutation
  .input(z.object({ orgId: z.string() }))
  .handler(async (ctx, args) => {
    const program = Effect.gen(function* () {
      const { auth, headers } = yield* getUserAuth(ctx)
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

export const markAsActive = markAsActiveFn.public()

export const createPersonalOrg = authedMutation
  .handler(async (ctx) => {
    const program = Effect.gen(function* () {
      const { auth, headers } = yield* getUserAuth(ctx)
      const user = yield* getUserById(ctx, ctx.userId)

      const org = yield* effectifyPromise(async () =>
        auth.api.createOrganization({
          body: {
            name: `${user.name}'s Organization`,
            slug: crypto.randomUUID(),
            keepCurrentActiveOrganization: false
          },
          headers
        })
      )
      if (!org) {
        return yield* new ServerError({
          message: "failed to create personal organization"
        })
      }

      yield* effectifyPromise(() =>
        ctx.db.patch("user", ctx.userId, { personalOrganizationId: org.id as Id<"organization"> })
      )

      yield* effectifyPromise(() => markAsActiveFn(ctx, { orgId: org?.id }))
      return org.slug
    })

    return await runEffOrThrow(appRuntime, program)
  })
  .public()
