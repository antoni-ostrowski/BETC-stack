import { env } from "@/env"
import {
  convexClient,
} from "@convex-dev/better-auth/client/plugins"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery } from "@tanstack/react-query"
import { createAuthClient } from "better-auth/react"
import { api } from "../../convex/_generated/api"

export const authClient = createAuthClient({
  baseURL: env.VITE_SITE_URL,
  plugins: [convexClient()],
})

export function useAuth() {
  const session = authClient.useSession()
  const userQuery = useQuery(convexQuery(api.user.queries.getMe, {}))
  return {
    session,
    user: userQuery.data,
    userQuery,
  }
}
