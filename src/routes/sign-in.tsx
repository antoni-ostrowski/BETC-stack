// import { Button } from "@/components/ui/button"
// import { authClient } from "@/lib/auth-client"
// import { createFileRoute, useRouter } from "@tanstack/react-router"
// import { useState } from "react"
//
// export const Route = createFileRoute("/sign-in")({
//   component: SignIn,
// })
//
// export function SignIn() {
//   const [isPending, setIsPending] = useState(false)
//   const router = useRouter()
//   return (
//     <div className="flex h-screen w-screen flex-col items-center justify-center">
//       <Button
//         onClick={async () => {
//           setIsPending(true)
//           const { data, error } = await authClient.signUp.email({
//             name: "John Doe", // required
//             email: "badebik426@lawior.com", // required
//             password: "password", // required
//           })
//           console.log({ data })
//           console.log({ error })
//           setIsPending(false)
//         }}
//       >
//         pass in
//       </Button>
//     </div>
//   )
// }
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createFileRoute("/sign-in")({
  component: AuthPage,
})

export function AuthPage() {
  const [view, setView] = useState<"sign-in" | "sign-up">("sign-in")
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const isSignUp = view === "sign-up"

  const cardTitle = isSignUp ? "Create an Account" : "Sign In"
  const cardDescription = isSignUp
    ? "Enter your information to create an account."
    : "Enter your email and password to access your account."

  const handleSubmit = async (type: "sign-in" | "sign-up") => {
    console.log(`Attempting ${type} with:`, formState)
    setIsPending(true)
    if (type === "sign-in") {
      const { data, error } = await authClient.signIn.email({
        email: formState.email,
        password: formState.password,
      })
    } else {
      const { data, error } = await authClient.signUp.email({
        name: formState.name,
        email: formState.email,
        password: formState.password,
      })
    }

    router.navigate({ to: "/" })
    setIsPending(false)
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-[380px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          {isSignUp && (
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formState.name}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={formState.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formState.password}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full"
            onClick={async () => await handleSubmit(view)}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>

          {isSignUp ? (
            <Button
              variant="link"
              className="text-sm"
              onClick={() => setView("sign-in")}
            >
              Already have an account? Sign In
            </Button>
          ) : (
            <Button
              variant="link"
              className="text-sm"
              onClick={() => setView("sign-up")}
            >
              Don't have an account? Create One
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
