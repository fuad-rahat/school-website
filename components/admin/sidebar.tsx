"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  Award,
  Calendar,
  ImageIcon,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Teachers",
    href: "/admin/teachers",
    icon: Users,
  },
  {
    title: "Alumni",
    href: "/admin/alumni",
    icon: GraduationCap,
  },
  {
    title: "Notices",
    href: "/admin/notices",
    icon: FileText,
  },
  {
    title: "Activities",
    href: "/admin/activities",
    icon: Calendar,
  },
  {
    title: "Achievements",
    href: "/admin/achievements",
    icon: Award,
  },
  {
    title: "Results",
    href: "/admin/results",
    icon: Award,
  },
  {
    title: "Gallery",
    href: "/admin/gallery",
    icon: ImageIcon,
  },
  {
    title: "Contact Messages",
    href: "/admin/messages",
    icon: Mail,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <>
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <div className="font-bold text-xl">Admin Panel</div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col w-72 bg-white border-r shadow-sm transition-transform md:translate-x-0 md:static",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-4 border-b">
          <h2 className="font-bold text-xl">শুকতারা বিদ্যানিকেতন</h2>
          <p className="text-sm text-muted-foreground">Admin Dashboard</p>
        </div>

        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t mt-auto">
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {isOpen && <div className="fixed inset-0 z-30 bg-black/20 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
