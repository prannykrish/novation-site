import type React from "react"
import { MainLayout } from "@/components/main-layout"
import { DndProviderClient } from "@/components/dnd-provider-client";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <DndProviderClient>
      <MainLayout>{children}</MainLayout>
    </DndProviderClient>
  )
}