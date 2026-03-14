import PageWrapper from "@/components/page-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { parseConvexError } from "@/lib/utils"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { api } from "@packages/convex"
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { PlusIcon, XIcon } from "lucide-react"
import { useState } from "react"

export const Route = createFileRoute("/authed-route/test")({
  beforeLoad: async (ctx) => {
    if (!ctx.context.isAuthenticated) {
      throw redirect({ to: "/sign-in" })
    }
  },
  component: RouteComponent,
  pendingComponent: () => (
    <PageWrapper className={"h-screen w-screen"}>
      <Spinner />
    </PageWrapper>
  )
})

function RouteComponent() {
  // this is the way to get current user SSR safe way.
  // (pending component gets triggered (and error), and user always sees the authed state)
  // use suspensy query in most situations
  const { data: user } = useSuspenseQuery(convexQuery(api.user.queries.getMe, {}))

  const [input, setInput] = useState("")

  // wrap convex mutations in tanstack hook.
  const { mutate: createNewTodo } = useMutation({
    meta: {
      // we can attach toast behaviour like this
      withToasts: true,
      loadingMessage: "Creating todo",
      successMessage: "Created todo",
      errorMessage: "failed!"
    },
    mutationFn: useConvexMutation(api.todo.mutations.create)
  })

  const { mutate: deleteTodo } = useMutation({
    meta: {
      withToasts: true,
      loadingMessage: "Deleting todo",
      successMessage: "Deleted todo"
    },
    mutationFn: useConvexMutation(api.todo.mutations.remove)
  })

  // this doesnt trigger pending component. on server will return undefined,
  // and will finish fething data on client. use suspenseQuery when possible
  const { data, error, isPending } = useQuery(convexQuery(api.todo.queries.list, {}))

  const { mutate } = useMutation({
    meta: {
      withToasts: true,
      successMessage: "Toggled todo!",
      loadingMessage: "Loading..."
    },
    mutationFn: useConvexMutation(api.todo.mutations.toggle)
  })

  return (
    <PageWrapper>
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">
          Hi {user?.name}! ({user?.email})
        </h1>
        <h1 className="text-2xl font-bold">
          You can access this page only when you are authenticated.
        </h1>

        <p className="text-muted-foreground">
          Try accessing this page manually with url when signed out.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <Input
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
              }}
              placeholder="Todo text"
            />
          </div>

          <Button
            onClick={async () => {
              createNewTodo({ text: input })
              setInput("")
            }}
          >
            <PlusIcon />
          </Button>

          {isPending && (
            <div className="flex items-center justify-center">
              <Spinner />
            </div>
          )}
          {error && <p className="text-destructive">{parseConvexError(error)}</p>}
          {data?.map((a) => {
            return (
              <div key={a._id} className="flex w-30 flex-row items-center justify-start gap-2">
                <input
                  type="checkbox"
                  checked={a.completed}
                  onChange={() => {
                    mutate({ id: a._id })
                  }}
                />
                <Button
                  variant={"ghost"}
                  onClick={() => {
                    deleteTodo({
                      todoId: a._id
                    })
                  }}
                >
                  <XIcon />
                </Button>

                {a.text}
              </div>
            )
          })}
        </div>
      </div>
    </PageWrapper>
  )
}
