import { createFileRoute, Link } from "@tanstack/react-router"
export const Route = createFileRoute("/")({
  component: App,
})

function App() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">welcome</h1>
      <div className="font-semibold">
        <Link to="/authed-route/test" className="hover:underline">
          <p>/authed-route/test - checkout authenticated route</p>
        </Link>
      </div>
    </div>
  )
}
