import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { authClient, useSession } from "@/lib/auth-client"
import { useTheme } from "@/lib/theme/theme-provider"
import { useRouter } from "@tanstack/react-router"
import { LogOut, Moon, Sun } from "lucide-react"
import { useState } from "react"

export function NavUser() {
  const { user } = useSession()

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex flex-col gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={(props) => (
              <SidebarMenuButton
                {...props}
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground p-0"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.image ?? undefined} />
                  <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </SidebarMenuButton>
            )}
          ></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <LogOutBtn />
            </DropdownMenuGroup>
            <SideBarThemeToggle />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function LogOutBtn() {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await authClient.signOut()
    await router.invalidate()
    await router.navigate({ to: "/" })
  }
  return (
    <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
      <AlertDialogTrigger
        className="flex-1"
        render={(props) => (
          <DropdownMenuItem {...props} className={"text-destructive"}>
            <LogOut />
            Wyloguj
          </DropdownMenuItem>
        )}
      ></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy na pewno chcesz się wylogować?</AlertDialogTitle>
          <AlertDialogDescription>
            Zostaniesz przekierowany na stronę główną.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleLogout}>
            Wyloguj się <LogOut />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function SideBarThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <DropdownMenuItem
      onClick={() => {
        if (theme === "dark") {
          setTheme("light")
        } else {
          setTheme("dark")
        }
      }}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      Motyw
    </DropdownMenuItem>
  )
}
