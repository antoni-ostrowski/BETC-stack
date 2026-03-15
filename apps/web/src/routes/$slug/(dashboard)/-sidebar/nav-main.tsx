import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"
import { ReactNode } from "react"

export function NavMain({
  items
}: {
  items: {
    title: string
    url: string
    icon: ReactNode
    isActive?: boolean
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Manage</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={`${item.title}-sidebar-item`}>
            <SidebarMenuButton
              render={(props) => (
                <Link {...props} to={item.url}>
                  {item.icon}
                  {item.title}
                </Link>
              )}
            ></SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
