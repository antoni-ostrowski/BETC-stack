import { DefaultCatchBoundary } from "@/components/router/default-error-boundary"
import { NotFound } from "@/components/router/default-not-found"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { fetchQuery } from "@/lib/auth-server"
import { tryCatch } from "@/lib/utils"
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"
import {
  fetchSession,
  getCookieName,
} from "@convex-dev/better-auth/react-start"
import { ConvexQueryClient } from "@convex-dev/react-query"
import { TanStackDevtools } from "@tanstack/react-devtools"
import type { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools"
import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { createServerFn } from "@tanstack/react-start"
import { getCookie, getRequest } from "@tanstack/react-start/server"
import { ConvexReactClient } from "convex/react"
import { api } from "../../convex/_generated/api"
import appCss from "../styles.css?url"

const fetchAuth = createServerFn({ method: "GET" }).handler(async () => {
  const { createAuth } = await import("../../convex/auth")
  const { session } = await fetchSession(getRequest())
  const sessionCookieName = getCookieName(createAuth)
  const token = getCookie(sessionCookieName)

  const [user, err] = await tryCatch(fetchQuery(api.user.query.getMe, {}))
  console.log("user fetched - ", user)
  return {
    userId: session?.user.id,
    token,
    user: user ?? undefined,
  }
})

export interface MyRouterContext {
  queryClient: QueryClient
  convexClient: ConvexReactClient
  convexQueryClient: ConvexQueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  beforeLoad: async (ctx) => {
    // all queries, mutations and action made with TanStack Query will be
    // authenticated by an identity token.
    const { userId, token, user } = await fetchAuth()

    // During SSR only (the only time serverHttpClient exists),
    // set the auth token to make HTTP queries with.
    if (token) {
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(token)
    }

    return { userId, token, user }
  },
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const context = useRouteContext({ from: Route.id })
  return (
    <ConvexBetterAuthProvider
      client={context.convexClient}
      authClient={authClient}
    >
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <SignOutBtn />
          {children}
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              {
                name: "Tanstack Query",
                render: <ReactQueryDevtoolsPanel />,
              },
            ]}
          />
          <Scripts />
        </body>
      </html>
    </ConvexBetterAuthProvider>
  )
}

function SignOutBtn() {
  const context = useRouteContext({ from: Route.id })
  const router = useRouter()
  if (!context.user) {
    return (
      <Link to={"/sign-in"}>
        <Button variant={"outline"}>Sign in</Button>
      </Link>
    )
  }

  return (
    <Button
      onClick={async () => {
        await authClient.signOut()
        await router.invalidate()
      }}
      variant={"outline"}
    >
      Sign out
    </Button>
  )
}
