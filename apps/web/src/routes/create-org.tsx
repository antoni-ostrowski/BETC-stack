import PageWrapper from "@/components/page-wrapper"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import { useDebouncedValue, debou } from "@tanstack/react-pacer"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useEffect, useState } from "react"

export const Route = createFileRoute("/create-org")({
  component: RouteComponent
})

function RouteComponent() {
  const [slugInput, setSlugInput] = useState("")
  const [slugStatus, setSlugStatus] = useState<"pending" | "free" | "taken">("free")
  const [nameInput, setNameInput] = useState("")
  const router = useRouter()

  const [debouncedSearch, _debouncer] = useDebouncedValue(slugInput, { wait: 500 }, (state) => ({
    isPending: state.isPending
  }))

  const { mutate: createOrg } = useMutation({
    meta: {
      withToasts: true,
      loadingMessage: "Creating org...",
      successMessage: "Created org",
      errorMessage: "Failed to create org :("
    },
    mutationFn: async () => {
      await authClient.organization.create({
        slug: slugInput,
        name: nameInput
      })
    },
    onSuccess: async () => {
      await router.navigate({ to: "/$slug/dashboard", params: { slug: slugInput } })
    }
  })

  function slugInputOnChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const slugRegex = /[^a-z0-9-]/g

    const cleanSlug = e.target.value.toLowerCase().replace(/\s+/g, "-").replace(slugRegex, "")

    setSlugStatus("pending")

    setSlugInput(cleanSlug)
  }

  useEffect(() => {
    void (async () => {
      setSlugStatus("pending")
      console.log("running slug check")
      const { data, error } = await authClient.organization.checkSlug({
        slug: debouncedSearch
      })
      if (error && error.code == "SLUG_IS_TAKEN") {
        console.log({ error })
        setSlugStatus("taken")
        return
      }
      if (data?.status) {
        setSlugStatus("free")
      }
    })()
  }, [debouncedSearch])

  return (
    <PageWrapper className="h-screen w-screen">
      <Card>
        <CardHeader>
          <CardTitle>Create org</CardTitle>
          <CardDescription>Create org</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start justify-start gap-4">
          <Input
            placeholder="Name"
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value)
            }}
          />
          <Input placeholder="Slug" value={slugInput} onChange={slugInputOnChangeHandler} />
          <p>{slugStatus === "pending" ? <Spinner /> : <>Slug is {slugStatus}</>}</p>
          <CardFooter className="w-full p-0">
            <Button onClick={() => createOrg()}>Create</Button>
          </CardFooter>
        </CardContent>
      </Card>
    </PageWrapper>
  )
}
