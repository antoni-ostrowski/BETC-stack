import { createFileRoute } from "@tanstack/react-router"
import { Link, useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"

export const Route = createFileRoute("/sign-in")({
  component: SignIn,
})

export function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignIn = async () => {
    const { data, error } = await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {},
        onSuccess: async (ctx) => {},
        onError: (ctx) => {},
      },
    )

    console.log({ data, error })
  }

  return (
    <div>
      <Card className="max-w-md">
        <Button
          onClick={async () => {
            void (await authClient.signIn.social({
              provider: "github",
            }))
          }}
        >
          github
        </Button>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSignIn()
            }}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                value={email}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="password"
                autoComplete="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full">
                Sign in with Password
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-neutral-500">
                  or continue with
                </span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <p className="text-center mt-4 text-sm text-neutral-600 dark:text-neutral-400">
        Don&apos;t have an account?{" "}
        <Link
          to="/"
          className="text-orange-400 hover:text-orange-500 dark:text-orange-300 dark:hover:text-orange-200 underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}
