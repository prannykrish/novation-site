'use client'

import React, { useState } from "react"
import { LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Helper function to get initials from the user's name
const getInitials = (name: string | undefined): string => {
  if (!name) return "NA"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export function NavUser({
  user,
  onProfileUpdate
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
  onProfileUpdate?: () => void
}) {
  const { isMobile } = useSidebar()
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [newName, setNewName] = useState(user.name || "")
  const [isUpdating, setIsUpdating] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Placeholder logout
  const handleLogout = async () => {
    alert("Logout is disabled (auth under construction).")
    // Simulate sign-out if needed
    window.location.href = "/signin"
  }

  // Placeholder profile update
  const handleUpdateProfile = async () => {
    if (!newName.trim()) {
      setErrorMessage("Name cannot be empty")
      return
    }

    setIsUpdating(true)
    setErrorMessage("")

    try {
      // Simulate a save
      console.log("Updated name:", newName)

      setShowEditProfile(false)

      if (onProfileUpdate) {
        onProfileUpdate()
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setErrorMessage("Failed to update profile. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name || "User"}</span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuItem onClick={() => setShowEditProfile(true)}>
                <User className="mr-2 h-4 w-4" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter your name"
              />
              {errorMessage && (
                <p className="text-sm text-destructive">{errorMessage}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditProfile(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
