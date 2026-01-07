import SignOutBtn from "@/components/auth/sign-out-btn"
import { DefaultCatchBoundary } from "@/components/router/default-error-boundary"
import { NotFound } from "@/components/router/default-not-found"
import { Toaster } from "@/components/ui/sonner"
import { authClient, getAuth } from "@/lib/auth-client"
import { PHProvider } from "@/lib/providers/posthog/provider"
import { getThemeServerFn } from "@/lib/providers/theme/theme"
import {
  ThemeProvider,
  themeScript
} from "@/lib/providers/theme/theme-provider"
import ThemeToggle from "@/lib/providers/theme/theme-toggle"
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"
import { ConvexQueryClient } from "@convex-dev/react-query"
import { TanStackDevtools } from "@tanstack/react-devtools"
import type { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools"
import {
  HeadContent,
  Outlet,
  ScriptOnce,
  Scripts,
  createRootRouteWithContext,
  useRouteContext
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache"
import { ConvexReactClient } from "convex/react"
import appCss from "../styles.css?url"

export interface MyRouterContext {
  queryClient: QueryClient
  convexClient: ConvexReactClient
  convexQueryClient: ConvexQueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        title: "TanStack Start Starter"
      }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  loader: () => getThemeServerFn(),
  // this will run on every page navigation,
  // but JWT caching from convex ensures the navigation
  // still feels snappy while keeping the app safe
  beforeLoad: async (ctx) => {
    const token = await getAuth()
    // all queries, mutations and actions through TanStack Query will be
    // authenticated during SSR if we have a valid token
    if (token) {
      // During SSR only (the only time serverHttpClient exists),
      // set the auth token to make HTTP queries with.
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(token)
    }
    return {
      isAuthenticated: !!token,
      token
    }
  },
  component: RootComponent
})

function RootComponent() {
  const context = useRouteContext({ from: Route.id })
  return (
    <PHProvider>
      <ConvexBetterAuthProvider
        client={context.convexClient}
        authClient={authClient}
        initialToken={context.token}
      >
        <ConvexQueryCacheProvider>
          <RootDocument>
            <Outlet />
          </RootDocument>
        </ConvexQueryCacheProvider>
      </ConvexBetterAuthProvider>
    </PHProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <HeadContent />
        </head>
        <body>
          <Toaster />
          <ScriptOnce>{themeScript}</ScriptOnce>
          <div className="absolute top-4 left-4 flex flex-row gap-2">
            <SignOutBtn />
            <div>
              <ThemeToggle />
            </div>
          </div>
          {children}
          <TanStackDevtools
            config={{
              position: "bottom-right"
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />
              },
              {
                name: "Tanstack Query",
                render: <ReactQueryDevtoolsPanel />
              }
            ]}
          />
          <Scripts />
        </body>
      </html>
    </ThemeProvider>
  )
}
