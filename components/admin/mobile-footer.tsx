"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, GraduationCap, Bell, Award, FileText } from "lucide-react"

export function MobileFooter() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      active: isActive("/admin/dashboard"),
    },
    {
      name: "Teachers",
      href: "/admin/teachers",
      icon: GraduationCap,
      active: isActive("/admin/teachers"),
    },
    {
      name: "Notices",
      href: "/admin/notices",
      icon: Bell,
      active: isActive("/admin/notices"),
    },
    {
      name: "Results",
      href: "/admin/results",
      icon: Award,
      active: isActive("/admin/results"),
    },
    {
      name: "About",
      href: "/admin/about",
      icon: FileText,
      active: isActive("/admin/about"),
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t md:hidden">
      <div className="grid h-full grid-cols-5">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`inline-flex flex-col items-center justify-center px-1 hover:bg-muted ${
              item.active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
