"use client"
import { Logo } from './logo'
import * as React from "react"
import { Database, FileText, MessageSquare, Plus } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { userService } from "@/lib/database"
import { DatabaseUser } from "@/types/database"

// Main navigation items
const mainNavItems = [
  {
    title: "Assets",
    icon: FileText,
    path: "/dashboard/assets",
  },
  {
    title: "Database Lookup",
    icon: Database,
    path: "/dashboard/lookup",
  },
  {
    title: "Messages",
    icon: MessageSquare,
    path: "/dashboard/messages",
  },
  {
    title: "Create",
    icon: Plus,
    path: "/dashboard/create",
  },
]

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [activeItem, setActiveItem] = React.useState(
    mainNavItems.find((item) => pathname.startsWith(item.path)) || mainNavItems[0],
  )
  
  // State for current user
  const [currentUser, setCurrentUser] = React.useState<DatabaseUser | null>(null)
  
  // Fetch current user on component mount
  React.useEffect(() => {
    fetchCurrentUser()
  }, [])
  
  // Function to fetch the current user - can be called after profile updates
  const fetchCurrentUser = async () => {
    try {
      const user = await userService.getCurrentUser()
      setCurrentUser(user)
    } catch (error) {
      console.error("Error fetching current user:", error)
    }
  }
  
  // Create a user object for NavUser component
  const userData = {
    user: {
      name: currentUser?.name || "User",
      email: currentUser?.email || "",
      avatar: currentUser?.avatar_url || "/avatars/shadcn.jpg",
    }
  }

  // Get the current page title for the breadcrumb
  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard"
    const item = mainNavItems.find((item) => pathname.startsWith(item.path))
    return item ? item.title : ""
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Main sidebar */}
        <Sidebar collapsible="icon" className="border-r shrink-0">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="/" className="flex justify-center items-center">
  <div className="flex w-full justify-center items-center gap-2 lg:w-auto">
    <Logo className="h-6 w-6" />
    <div className="grid flex-1 text-center text-sm leading-tight">
      <span className="truncate font-semibold">Novation</span>
      <span className="truncate text-xs text-muted-foreground"></span>
    </div>
  </div>
</a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent className="px-1.5 md:px-0">
                <SidebarMenu>
                  {mainNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        tooltip={{
                          children: item.title,
                          hidden: false,
                        }}
                        onClick={() => {
                          setActiveItem(item)
                          router.push(item.path)
                        }}
                        isActive={activeItem?.title === item.title}
                        className="px-2.5 md:px-2"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={userData.user} onProfileUpdate={fetchCurrentUser} />
          </SidebarFooter>
        </Sidebar>

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden w-full">
          <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-2 border-b bg-background p-4 w-full">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
