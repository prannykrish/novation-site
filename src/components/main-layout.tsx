"use client"
import { Logo } from './logo'
import * as React from "react"
import { Database, FileText, MessageSquare, Plus, Bell } from "lucide-react"
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
import { messageService, userService } from "@/lib/database"
import { DatabaseUser } from "@/types/database"
import { getSupabase } from "@/lib/supabase"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useNotifications } from '@/context/NotificationContext'

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
  
  // Get unread count from NotificationContext instead of local state
  const { unreadCount: unreadMessages, refreshUnreadCount } = useNotifications();
  
  // Fetch current user on component mount
  React.useEffect(() => {
    fetchCurrentUser();
  }, []);
  
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

  // Function to navigate to messages page
  const goToMessages = () => {
    router.push('/dashboard/messages')
  }

  // Get the current page title for the breadcrumb
  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard"
    const item = mainNavItems.find((item) => pathname.startsWith(item.path))
    return item ? item.title : ""
  }

  return (
    <SidebarProvider>
      {/* No longer need the MessageNotificationListener here since we're using the context */}
      
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
                        {item.title === "Messages" && unreadMessages > 0 && (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {unreadMessages}
                          </span>
                        )}
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
                  <BreadcrumbItem>
                    <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="relative" onClick={goToMessages}>
                    <Bell className="h-5 w-5" />
                    {unreadMessages > 0 && (
                      <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                        {unreadMessages}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Messages</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={refreshUnreadCount}
                        className="h-8 w-8 p-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
                      </Button>
                    </div>
                    {unreadMessages > 0 ? (
                      <div>
                        <p className="text-sm">You have {unreadMessages} unread messages.</p>
                        <Button 
                          className="w-full mt-2" 
                          size="sm" 
                          onClick={goToMessages}
                        >
                          View Messages
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No unread messages</p>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
