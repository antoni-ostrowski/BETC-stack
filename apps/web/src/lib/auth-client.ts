import { env } from "@/env"
import { isAuthError } from "@/lib/utils"
import { convexClient } from "@convex-dev/better-auth/client/plugins"
import { convexBetterAuthReactStart } from "@convex-dev/better-auth/react-start"
import { createServerFn } from "@tanstack/react-start"
import { createAuthClient } from "better-auth/react"
import { createAuthMutations } from "better-convex/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL!,
  plugins: [convexClient()]
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
