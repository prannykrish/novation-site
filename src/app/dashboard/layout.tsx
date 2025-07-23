import type React from "react"
//import { MainLayout } from "@/components/main-layout"
import { DndProviderClient } from "@/components/dnd-provider-client";
//import { MessageNotificationListener } from "@/components/message-notification-listener";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <DndProviderClient>
      
      {children}
      {/* <MessageNotificationListener />
      <MainLayout>{children}</MainLayout> */}
    </DndProviderClient>
  )
}