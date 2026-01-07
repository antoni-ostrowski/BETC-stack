import { env } from "@/env"
import { isAuthError } from "@/lib/utils"
import { convexClient } from "@convex-dev/better-auth/client/plugins"
import { convexBetterAuthReactStart } from "@convex-dev/better-auth/react-start"
import { convexQuery } from "@convex-dev/react-query"
import { polarClient } from "@polar-sh/better-auth"
import { useQuery } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { createAuthClient } from "better-auth/react"
import { api } from "../../convex/_generated/api"

export const authClient = createAuthClient({
  baseURL: env.VITE_SITE_URL,
  plugins: [polarClient(), convexClient()]
})

// those are necessary utils to fetch convex functions from tanstack server code
export const {
  handler,
  getToken,
  fetchAuthQuery,
  fetchAuthMutation,
  fetchAuthAction
} = convexBetterAuthReactStart({
  convexUrl: env.VITE_CONVEX_URL,
  convexSiteUrl: env.VITE_CONVEX_SITE_URL,
  jwtCache: {
    enabled: true,
    isAuthError
  }
})

/**
 * Combines useSession and getMe query to get full user data. Use this only if you need access to current users profile data (your custom one) AND the auth data.
 * Otherwise, if you just need current session call authClient.useSession(), whicch returns current session
 * that includes only the user (better) auth data.
 */
export function useUserAndSession() {
  const session = authClient.useSession()
  const userQuery = useQuery(convexQuery(api.user.queries.getMe, {}))
  return {
    session: session.data,
    sessionQuery: session,
    user: userQuery.data,
    userQuery
  }
}

/**
 * Gets current user auth session and the query state.
 * (Returns the data pretty much instantly)
 */
export function useSession() {
  const session = authClient.useSession()
  return {
    session: session.data,
    sessionQuery: session
  }
}

/**
 * Gets current user profile data and the query state.
 */
export function useUser() {
  const userQuery = useQuery(convexQuery(api.user.queries.getMe, {}))
  return {
    user: userQuery.data,
    userQuery
  }
}

/**
 * This is server function to fetch the data from convex using current cookies. It's a default func from convex + better auth docs.
 */
export const getAuth = createServerFn({ method: "GET" }).handler(async () => {
  return await getToken()
})
