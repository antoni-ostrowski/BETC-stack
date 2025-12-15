import { parseConvexError } from "@/lib/utils"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { api } from "../../convex/_generated/api"

export const Route = createFileRoute("/")({
  component: App
})

function App() {
  const { data, error } = useQuery(convexQuery(api.todo.queries.list, {}))
  const { mutate } = useMutation({
    mutationFn: useConvexMutation(api.todo.mutations.toggle)
  })

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">welcome</h1>
      <div className="font-semibold">
        <Link to="/authed-route/test" className="hover:underline">
          <p>/authed-route/test - checkout authenticated route</p>
        </Link>
      </div>
      <h2 className="text-muted-foreground">
        Try toggling the todo state from convex dashboard and see how client
        reacts.
      </h2>
      {data?.map((a) => {
        return (
          <div key={a._id} className="flex flex-row gap-2">
            {a.text}

            <input
              type="checkbox"
              checked={a.completed}
              onChange={() => mutate({ id: a._id })}
            />
          </div>
        )
      })}
      {error && <p className="text-destructive">{parseConvexError(error)}</p>}
    </div>
  )
}
