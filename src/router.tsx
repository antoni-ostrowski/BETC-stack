import { ConvexQueryClient } from "@convex-dev/react-query"
import { QueryClient, notifyManager } from "@tanstack/react-query"
import { createRouter } from "@tanstack/react-router"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import { ReactNode } from "react"
import { NotFound } from "./components/default-not-found"
import { DefaultCatchBoundary } from "./components/defuault-error-boundary"
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
      <ConvexProvider client={convexQueryClient.convexClient}>
        {children}
      </ConvexProvider>
    ),
  })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
