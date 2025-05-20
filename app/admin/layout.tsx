import type React from "react"
import { ResponsiveSidebar } from "@/components/admin/responsive-sidebar"
import { MobileFooter } from "@/components/admin/mobile-footer"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <ResponsiveSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">{children}</main>
        <MobileFooter />
      </div>
    </div>
  )
}
