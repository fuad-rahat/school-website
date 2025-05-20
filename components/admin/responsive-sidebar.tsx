"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, Bell, Calendar, Award, BookOpen, LogOut, Menu, X, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
}

export function ResponsiveSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        router.push("/admin/login")
      } else {
        console.error("Logout failed")
      }
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const routes = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/teachers",
      label: "Teachers",
      icon: Users,
    },
    {
      href: "/admin/notices",
      label: "Notices",
      icon: Bell,
    },
    {
      href: "/admin/activities",
      label: "Activities",
      icon: Calendar,
    },
    {
      href: "/admin/results",
      label: "Results",
      icon: Award,
    },
    {
      href: "/admin/alumni",
      label: "Alumni",
      icon: GraduationCap,
    },
    {
      href: "/admin/about",
      label: "About",
      icon: BookOpen,
    },
  ]

  if (!isClient) {
    return null
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden absolute left-4 top-4 z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Admin Panel</h2>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid gap-1 px-2">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      pathname === route.href ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                    )}
                  >
                    <route.icon className="h-4 w-4" />
                    {route.label}
                  </Link>
                ))}
              </nav>
            </div>
            
          </div>
        </SheetContent>
      </Sheet>

      <div className={cn("hidden md:flex h-screen w-64 flex-col border-r bg-background", className)}>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  pathname === route.href ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 lg:mt-44 border-t">
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
        </div>
        
      </div>
    </>
  )
}
