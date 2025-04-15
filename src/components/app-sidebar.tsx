"use client"

import * as React from "react"
import { Database, FileText, MessageSquare, Plus } from "lucide-react"

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

export function AppSidebar({
  activePath = "/assets",
  ...props
}: React.ComponentProps<typeof Sidebar> & { activePath?: string }) {
  const [activeItem, setActiveItem] = React.useState(
    mainNavItems.find((item) => item.path === activePath) || mainNavItems[0],
  )
  const { setOpen } = useSidebar()

  return (
    <Sidebar collapsible="icon" className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row" {...props}>
      {/* Main sidebar */}
      <Sidebar collapsible="none" className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
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
                        // In a real app, you would use router.push(item.path) here
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
          <NavUser user={userData.user} />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar - it will be different based on the active item */}
      {activeItem && (
        <Sidebar collapsible="none" className="hidden flex-1 md:flex">
          {activeItem.title === "Assets" && <AssetsSidebar />}
          {activeItem.title === "Database Lookup" && <DatabaseSidebar />}
          {activeItem.title === "Messages" && <MessagesSidebar />}
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

// Update the MessagesSidebar function to improve button placement
function MessagesSidebar() {
  // Sample messages
  const messages = [
    { id: 1, sender: "John Doe", subject: "Project Update", date: "Today", read: true },
    { id: 2, sender: "Jane Smith", subject: "Meeting Tomorrow", date: "Yesterday", read: false },
    { id: 3, sender: "Alex Johnson", subject: "New Feature Request", date: "2 days ago", read: true },
    { id: 4, sender: "Sarah Williams", subject: "Feedback on Design", date: "3 days ago", read: false },
    { id: 5, sender: "Mike Brown", subject: "Weekly Report", date: "1 week ago", read: true },
  ]

  return (
    <>
      <SidebarHeader className="border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">Messages</div>
          <Button variant="outline" size="sm" className="h-8">
            <Plus className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>
        <SidebarInput placeholder="Search messages..." className="mt-2" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {messages.map((message) => (
              <a
                href="#"
                key={message.id}
                className={`flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                  !message.read ? "bg-sidebar-accent/30" : ""
                }`}
              >
                <div className="flex w-full items-center gap-2">
                  <span className="font-medium">{message.sender}</span>
                  <span className="ml-auto text-xs">{message.date}</span>
                </div>
                <span>{message.subject}</span>
              </a>
            ))}
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
