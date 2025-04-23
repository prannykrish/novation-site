"use client"

import * as React from "react"
import { Database, FileText, MessageSquare, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { messageService } from "@/lib/database"
import { Message } from "@/types/database"
import { getSupabase } from "@/lib/supabase"

import { NavUser } from "./nav-user"
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
  useSidebar,
} from "@/components/ui/sidebar"

// Sample user data
const userData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
}

// Main navigation items
const mainNavItems = [
  {
    title: "Assets",
    icon: FileText,
    path: "/assets",
  },
  {
    title: "Database Lookup",
    icon: Database,
    path: "/database",
  },
  {
    title: "Messages",
    icon: MessageSquare,
    path: "/messages",
  },
  {
    title: "Create",
    icon: Plus,
    path: "/create",
  },
]

// Main navigation items with dynamic badges
export function AppSidebar({
  activePath = "/assets",
  ...props
}: React.ComponentProps<typeof Sidebar> & { activePath?: string }) {
  const [activeItem, setActiveItem] = React.useState(
    mainNavItems.find((item) => item.path === activePath) || mainNavItems[0],
  )
  const [unreadMessageCount, setUnreadMessageCount] = React.useState(0)
  const [lastMessageTime, setLastMessageTime] = React.useState<Date | null>(null)
  const { setOpen } = useSidebar()
  const router = useRouter()

  // Fetch unread message count on load
  React.useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const messages = await messageService.getUserMessages()
        const unreadCount = messages.filter(msg => !msg.isRead).length
        setUnreadMessageCount(unreadCount)
        
        // Set the last message time if there are any messages
        if (messages.length > 0) {
          const sortedMessages = [...messages].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          setLastMessageTime(new Date(sortedMessages[0].createdAt))
        }
      } catch (error) {
        console.error("Error fetching unread messages:", error)
      }
    }

    fetchUnreadMessages()

    // Set up real-time subscription for new messages
    const supabase = getSupabase()
    
    // Only proceed if we're in a browser environment
    if (typeof window === 'undefined') return
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        // Subscribe to new messages
        const messageSubscription = supabase
          .channel('sidebar_messages_channel')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `recipient_id=eq.${session.user.id}`,
          }, (payload) => {
            // Update unread count by refetching messages
            fetchUnreadMessages()
            
            // Play notification sound for new messages
            try {
              const audio = new Audio('/notification.mp3')
              audio.volume = 0.5 // Set volume to 50%
              audio.play().catch(e => console.log('Audio play prevented:', e))
            } catch (e) {
              console.log('Error playing notification sound:', e)
            }
            
            // Show browser notification if permitted
            if (
              'Notification' in window && 
              Notification.permission === 'granted' && 
              document.visibilityState !== 'visible'
            ) {
              const payloadData: any = payload.new
              new Notification('New Message', {
                body: `You have a new message${payloadData.subject ? ': ' + payloadData.subject : ''}`,
                icon: '/images/logo.png'
              })
            }
          })
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'messages',
            filter: `recipient_id=eq.${session.user.id}`,
          }, () => {
            // Update unread count when a message is marked as read
            fetchUnreadMessages()
          })
          .subscribe()
          
        // Cleanup subscription when component unmounts
        return () => {
          messageSubscription.unsubscribe()
        }
      }
    })
    
    // Request notification permission on component mount
    if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission()
    }
    
    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Format time since last message
  const getTimeSinceLastMessage = () => {
    if (!lastMessageTime) return ''
    
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - lastMessageTime.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    return lastMessageTime.toLocaleDateString()
  }

  return (
    <Sidebar collapsible="icon" className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row" {...props}>
      {/* Main sidebar */}
      <Sidebar collapsible="none" className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="/dashboard">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Plus className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Dashboard</span>
                    <span className="truncate text-xs">Workspace</span>
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
                        setOpen(true)
                        router.push(`/dashboard${item.path}`)
                      }}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2 relative"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                      {item.title === "Messages" && unreadMessageCount > 0 && (
                        <span className="absolute right-0 top-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                          {unreadMessageCount > 9 ? "9+" : unreadMessageCount}
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
          <NavUser user={userData.user} />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar - it will be different based on the active item */}
      {activeItem && (
        <Sidebar collapsible="none" className="hidden flex-1 md:flex">
          {activeItem.title === "Assets" && <AssetsSidebar />}
          {activeItem.title === "Database Lookup" && <DatabaseSidebar />}
          {activeItem.title === "Messages" && <MessagesSidebar unreadCount={unreadMessageCount} />}
          {activeItem.title === "Create" && <CreateSidebar />}
        </Sidebar>
      )}
    </Sidebar>
  )
}

// Replace the DatabaseSidebar function with an empty component since we don't need a sidebar for Database
function DatabaseSidebar() {
  // Empty sidebar for Database section
  return (
    <>
      <SidebarHeader className="border-b p-4">
        <div className="text-base font-medium text-foreground">Database Lookup</div>
      </SidebarHeader>
      <SidebarContent>{/* No sidebar content for Database section */}</SidebarContent>
    </>
  )
}

// Update the AssetsSidebar function to improve button placement
function AssetsSidebar() {
  // Sample asset folders
  const folders = [
    { name: "Recent Assets", count: 12 },
    { name: "Past Assets", count: 45 },
    { name: "Project Alpha", count: 8 },
    { name: "Project Beta", count: 15 },
  ]

  return (
    <>
      <SidebarHeader className="border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">Assets</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-2 py-1">
            <SidebarGroupLabel>Folders</SidebarGroupLabel>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Plus className="h-4 w-4" />
              <span className="sr-only">New Folder</span>
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {folders.map((folder) => (
                <SidebarMenuItem key={folder.name}>
                  <SidebarMenuButton className="justify-between">
                    <span>{folder.name}</span>
                    <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs">{folder.count}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  )
}

// Update the MessagesSidebar function to display real messages from the database
function MessagesSidebar({ unreadCount }: { unreadCount: number }) {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [loading, setLoading] = React.useState(true)
  const router = useRouter()

  React.useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true)
        const userMessages = await messageService.getUserMessages()
        setMessages(userMessages)
      } catch (error) {
        console.error("Error fetching messages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    // Set up real-time subscription for message updates
    const supabase = getSupabase()
    
    // Only proceed if we're in a browser environment
    if (typeof window === 'undefined') return
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        const messageSubscription = supabase
          .channel('messages_sidebar_channel')
          .on('postgres_changes', {
            event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
            schema: 'public',
            table: 'messages',
            filter: `recipient_id=eq.${session.user.id}`,
          }, () => {
            // Refetch messages when any change occurs
            fetchMessages()
          })
          .subscribe()
          
        return () => {
          messageSubscription.unsubscribe()
        }
      }
    })
    
    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const handleNewMessage = () => {
    router.push('/dashboard/messages/new')
  }

  // Format timestamp to relative time (like "2 hours ago")
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    
    return date.toLocaleDateString()
  }

  return (
    <>
      <SidebarHeader className="border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">
            Messages {unreadCount > 0 && <span className="ml-2 text-sm text-primary">({unreadCount} unread)</span>}
          </div>
          <Button variant="outline" size="sm" className="h-8" onClick={handleNewMessage}>
            <Plus className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>
        <SidebarInput placeholder="Search messages..." className="mt-2" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No messages yet
              </div>
            ) : (
              messages.map((message) => (
                <a
                  href={`/dashboard/messages/${message.senderId}`}
                  key={message.id}
                  className={`flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                    !message.isRead ? "bg-sidebar-accent/30" : ""
                  }`}
                >
                  <div className="flex w-full items-center gap-2">
                    <span className="font-medium">{message.senderName || message.senderEmail || 'Unknown User'}</span>
                    <span className="ml-auto text-xs">{formatRelativeTime(message.createdAt)}</span>
                  </div>
                  <span className="truncate max-w-full">{message.subject}</span>
                </a>
              ))
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  )
}

// Update the CreateSidebar function to improve button placement
function CreateSidebar() {
  // Sample chat history
  const chatHistory = [
    { id: 1, name: "Project Brainstorm", date: "Today", folder: "Work" },
    { id: 2, name: "Marketing Ideas", date: "Yesterday", folder: "Work" },
    { id: 3, name: "Personal Notes", date: "3 days ago", folder: "Personal" },
    { id: 4, name: "Research Topics", date: "1 week ago", folder: "Research" },
  ]

  // Sample folders
  const folders = ["Work", "Personal", "Research"]

  return (
    <>
      <SidebarHeader className="border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">Chat History</div>
          <Button variant="outline" size="sm" className="h-8">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
        <SidebarInput placeholder="Search chats..." className="mt-2" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-2 py-1">
            <SidebarGroupLabel>Folders</SidebarGroupLabel>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Plus className="h-4 w-4" />
              <span className="sr-only">New Folder</span>
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {folders.map((folder) => (
                <SidebarMenuItem key={folder}>
                  <SidebarMenuButton>
                    <span>{folder}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatHistory.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton className="justify-between">
                    <span>{chat.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{chat.date}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  )
}

// Import for SidebarInput
import { SidebarInput } from "@/components/ui/sidebar"
import { SidebarGroupLabel } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
