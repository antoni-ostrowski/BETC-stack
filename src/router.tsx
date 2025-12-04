import { ConvexQueryClient } from "@convex-dev/react-query"
import { QueryClient, notifyManager } from "@tanstack/react-query"
import { createRouter } from "@tanstack/react-router"
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import { ReactNode } from "react"
import { DefaultCatchBoundary } from "./components/router/default-error-boundary"
import { NotFound } from "./components/router/default-not-found"
import { ThemeProvider } from "./lib/providers/theme/theme-provider"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
  if (typeof document !== "undefined") {
    notifyManager.setScheduler(window.requestAnimationFrame)
  }

  const CONVEX_URL = import.meta.env.VITE_CONVEX_URL!
  if (!CONVEX_URL) {
    console.error("missing envar CONVEX_URL")
  }

  const convex = new ConvexReactClient(CONVEX_URL, {
    unsavedChangesWarning: false,
    logger: true,
    verbose: true,
  })

  const convexQueryClient = new ConvexQueryClient(convex)

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  })

  convexQueryClient.connect(queryClient)

  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    context: { queryClient, convexClient: convex, convexQueryClient },
    Wrap: ({ children }: { children: ReactNode }) => (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ConvexProvider client={convexQueryClient.convexClient}>
          <ConvexQueryCacheProvider>{children}</ConvexQueryCacheProvider>
        </ConvexProvider>
      </ThemeProvider>
    ),
  })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
