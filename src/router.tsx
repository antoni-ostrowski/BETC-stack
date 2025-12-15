import { ConvexQueryClient } from "@convex-dev/react-query"
import {
  QueryClient,
  QueryClientProvider,
  notifyManager
} from "@tanstack/react-query"
import { createRouter } from "@tanstack/react-router"
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import { Effect } from "effect"
import { ReactNode } from "react"
import { DefaultCatchBoundary } from "./components/router/default-error-boundary"
import { NotFound } from "./components/router/default-not-found"
import { env } from "./env"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
  if (typeof document !== "undefined") {
    notifyManager.setScheduler(window.requestAnimationFrame)
  }

  if (!env.VITE_CONVEX_URL) {
    Effect.runSync(Effect.logError("missing envar VITE_CONVEX_URL"))
  }

  const convex = new ConvexReactClient(env.VITE_CONVEX_URL, {
    unsavedChangesWarning: false,
    logger: true,
    verbose: true
  })

  const convexQueryClient = new ConvexQueryClient(convex)

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn()
      }
    }
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
      <ConvexProvider client={convexQueryClient.convexClient}>
        <QueryClientProvider client={convexQueryClient.queryClient}>
          <ConvexQueryCacheProvider>{children}</ConvexQueryCacheProvider>
        </QueryClientProvider>
      </ConvexProvider>
    )
  })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
