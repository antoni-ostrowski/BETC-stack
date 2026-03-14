import { Effect } from "effect"

import { DatabaseError } from "../errors"
import { authedQuery } from "../lib"
import { appRuntime } from "../runtime"
import { effectifyPromise, runEffOrThrow } from "../utils_effect"

// export const list = authedQuery
//   .handler(async (ctx) => {
//     const program = Effect.gen(function* () {
//       const { auth, headers } = yield* ctx.getAuth
//       const orgList = yield* effectifyPromise(
//         () =>
//           auth.api.listOrganizations({
//             headers
//           }),
//         (a) => new DatabaseError(a)
//       )
//       console.log({ orgList })
//       return orgList
//     })
//
//     return runEffOrThrow(appRuntime, program)
//   })
//   .public()
