import { env } from "@/env"
import { convexClient } from "@convex-dev/better-auth/client/plugins"
import {
  fetchSession,
  getCookieName
} from "@convex-dev/better-auth/react-start"
import { convexQuery, ConvexQueryClient } from "@convex-dev/react-query"
import { QueryClient, useQuery } from "@tanstack/react-query"
import { redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getCookie, getRequest } from "@tanstack/react-start/server"
import { createAuthClient } from "better-auth/react"
import { api } from "../../convex/_generated/api"

export const authClient = createAuthClient({
  baseURL: env.VITE_SITE_URL,
  plugins: [convexClient()]
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
 * Uses query clients to fetch auth data using tanstack query to add all sorts of benefits over
 * base bone server fn call.
 * Use this inside your route beforeLoad/loader to ensure user is signed in.
 */
export async function ensureAuthDataOrThrow(
  qc: QueryClient,
  convexQc: ConvexQueryClient
) {
  // ensureQueryData will most of the time hit tanstack query cache, so the navigation will still be instant.
  // We just need to make sure to reset this query data on sign out. (with resetQueries in SignOutBtn.tsx)
  const data = await qc.ensureQueryData({
    queryFn: myFetchAuth,
    queryKey: ["auth"]
  })

  if (data.token) {
    convexQc.serverHttpClient?.setAuth(data.token)
  }

  if (!data.token || !data.userId) {
    throw redirect({ to: "/sign-in" })
  }

  return data
}

/**
 * This is server function to fetch the data from convex using current cookies. It's a default func from convex + better auth docs.
 */
const myFetchAuth = createServerFn({ method: "GET" }).handler(async () => {
  const { createAuth } = await import("../../convex/auth")
  const { session } = await fetchSession(getRequest())
  const sessionCookieName = getCookieName(createAuth)
  const token = getCookie(sessionCookieName)
  return {
    userId: session?.user.id,
    token
  }
})
