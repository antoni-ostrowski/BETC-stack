import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"

export function AppSidebar({ slug }: { slug: string }) {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={(props) => <OrgDropdown {...props} slug={slug} />}
            ></SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain {...{ slug }} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

function OrgDropdown({ slug }: { slug: string }) {
  const router = useRouter()
  const qc = useQueryClient()
  const { data: org } = useQuery({
    queryKey: ["getOrg"],
    queryFn: async () => {
      return (
        await authClient.organization.getFullOrganization({
          query: { organizationSlug: slug }
        })
      ).data
    }
  })
  const { data: orgs } = authClient.useListOrganizations()
  const { mutate: markAsActive } = useMutation({
    mutationFn: async (orgId: string) => {
      const { data, error } = await authClient.organization.setActive({
        organizationId: orgId
      })
      console.log(data)
      console.log(error)
    }
  })
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={(props) => (
          <SidebarMenuButton
            {...props}
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground p-0"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={undefined} />
              <AvatarFallback className="rounded-lg"></AvatarFallback>
            </Avatar>
            <div className="flex flex-row gap-2">
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{org?.name}</span>
                <span className="truncate text-xs">{org?.name}</span>
              </div>
            </div>
          </SidebarMenuButton>
        )}
      ></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          {orgs?.map((org) => (
            <DropdownMenuItem
              key={org.id + "org-dropdown"}
              onClick={async () => {
                markAsActive(org.id)
                await router.navigate({
                  to: "/$slug/dashboard",
                  params: { slug: org.slug }
                })
                await router.invalidate()
                await qc.invalidateQueries({ queryKey: ["getOrg"] })
              }}
            >
              {org.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
