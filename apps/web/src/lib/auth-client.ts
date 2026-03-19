import { env } from "@/env"
import { convexClient } from "@convex-dev/better-auth/client/plugins"
import { convexBetterAuthReactStart } from "@convex-dev/better-auth/react-start"
import { convexQuery } from "@convex-dev/react-query"
import { api } from "@packages/convex"
import { isAuthError } from "@packages/convex"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { useLocation } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { organizationClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { createAuthMutations } from "better-convex/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
  plugins: [convexClient(), organizationClient()]
})

// Export mutation hooks for TanStack Query
export const {
  useSignOutMutationOptions,
  useSignInSocialMutationOptions,
  useSignInMutationOptions,
  useSignUpMutationOptions
} = createAuthMutations(authClient)

// those are necessary utils to fetch convex functions from tanstack server code
export const { handler, getToken, fetchAuthQuery, fetchAuthMutation, fetchAuthAction } =
  convexBetterAuthReactStart({
    convexUrl: env.VITE_CONVEX_URL,
    convexSiteUrl: env.VITE_CONVEX_SITE_URL,
    jwtCache: {
      enabled: true,
      isAuthError
    }
  })

/**
 * This is server function to fetch the data from convex using current cookies. It's a default func from convex + better auth docs.
 */
export const getAuth = createServerFn({ method: "GET" }).handler(async () => {
  return await getToken()
})

export function useUserSuspense() {
  return useSuspenseQuery(convexQuery(api.user.queries.getMe, {}))
}

export function useUser() {
  return useQuery(convexQuery(api.user.queries.getMe, {}))
}

export function useCurrentDashOrgSlug() {
  const location = useLocation()
  const orgSlug = location.href.split("/")[1]
  return orgSlug
}

export function useCurrentDashOrg() {
  const location = useLocation()
  const orgSlug = location.href.split("/")[1]

  return useQuery(convexQuery(api.org.queries.getOrgBySlug, { slug: orgSlug ?? "" }))
}

export function useCurrentDashOrgSuspense() {
  const location = useLocation()
  const orgSlug = location.href.split("/")[1]

  return useSuspenseQuery(convexQuery(api.org.queries.getOrgBySlug, { slug: orgSlug ?? "" }))
}
