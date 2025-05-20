"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, BookOpen, Bell, Award, Users, GraduationCap } from "lucide-react"

export default function MobileFooter() {
  const pathname = usePathname()
  const router = useRouter()

  // Don't show on admin pages
  if (pathname.startsWith("/admin")) {
    return null
  }

  const navItems = [
    {
      name: "হোম",
      href: "/",
      icon: Home,
      active: pathname === "/",
    },
    {
      name: "ফলাফল",
      href: "/results",
      icon: Award,
      active: pathname.startsWith("/results"),
    },
    {
      name: "নোটিশ",
      href: "/notice",
      icon: Bell,
      active: pathname.startsWith("/notice"),
    },
    {
      name: "শিক্ষক",
      href: "/teachers",
      icon: Users,
      active: pathname.startsWith("/teachers"),
    },
    {
      name: "প্রাক্তন",
      href: "/alumni",
      icon: GraduationCap,
      active: pathname.startsWith("/alumni"),
    },
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 md:hidden">
      <div className="grid h-full grid-cols-5">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.href)}
            className={`inline-flex flex-col items-center justify-center px-1 ${
              item.active ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
