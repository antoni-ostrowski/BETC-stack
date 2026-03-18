import { DefaultCatchBoundary } from "@/components/default-error-boundary"
import { NotFound } from "@/components/default-not-found"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider, useGetTheme } from "@/lib/theme/theme-provider"
import ThemeToggle from "@/lib/theme/theme-toggle"
import { ConvexQueryClient } from "@convex-dev/react-query"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { type QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools"
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useLocation
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"

import appCss from "../styles.css?url"

export interface MyRouterContext {
  queryClient: QueryClient
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
  // this will run on every page navigation,
  // but JWT caching from convex ensures the navigation
  // still feels snappy while keeping the app safe
  component: RootComponent
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const theme = useGetTheme()
  const { pathname } = useLocation()

  return (
    <ThemeProvider theme={theme}>
      <html lang="en" suppressHydrationWarning className={theme}>
        <head>
          <HeadContent />
        </head>
        <body>
          <Toaster />
          <div className="absolute top-4 left-4 flex flex-row gap-2">
            {!pathname.includes("dashboard") && (
              <>
                <div className="flex flex-row gap-2">
                  <ThemeToggle />
                </div>
              </>
            )}
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
