import { fetchAuthMutation } from "@/lib/auth-client"
import { tryCatch } from "@/lib/utils"
import { api } from "@packages/convex"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/api/org/$")({
  server: {
    handlers: {
      GET: async () => {
        const [orgSlug, err] = await tryCatch(
          fetchAuthMutation(api.org.mutations.createPersonalOrg)
        )
        if (err) {
          console.error(err)
          throw redirect({ to: "/" })
        }

        throw redirect({ to: "/$slug/dashboard", params: { slug: orgSlug } })
      }
    }
  }
})
