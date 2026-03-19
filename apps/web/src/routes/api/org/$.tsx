import { fetchAuthMutation } from "@/lib/auth-client"
import { api, tryCatch } from "@packages/convex"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/api/org/$")({
  server: {
    handlers: {
      GET: async () => {
        console.log("running api org endpoint")
        const [orgSlug, err] = await tryCatch(
          fetchAuthMutation(api.org.mutations.createPersonalOrg)
        )
        console.log("fetched mutations")
        if (err) {
          console.error(err)
          throw redirect({ to: "/" })
        }
        console.log("throwing redirect")

        throw redirect({ to: "/$slug/dashboard", params: { slug: orgSlug } })
      }
    }
  }
})
