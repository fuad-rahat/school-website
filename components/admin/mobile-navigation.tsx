"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutGrid, PlusCircle, Users, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileNavigationProps {
  className?: string
}

export function MobileNavigation({ className }: MobileNavigationProps) {
  const pathname = usePathname()

  const routes = [
    {
      href: "/admin/dashboard",
      label: "Home",
      icon: Home,
    },
    {
      href: "/admin",
      label: "All",
      icon: LayoutGrid,
    },
    {
      href: "/admin/teachers/new",
      label: "Add New",
      icon: PlusCircle,
    },
    {
      href: "/admin/teachers",
      label: "Faculty",
      icon: Users,
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: Settings,
    },
  ]

  return (
    <div className={cn("fixed bottom-0 left-0 z-50 w-full border-t bg-background", className)}>
      <div className="grid h-16 grid-cols-5">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-foreground",
              pathname === route.href && "text-primary",
            )}
          >
            <route.icon className="h-5 w-5" />
            <span className="text-xs">{route.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
