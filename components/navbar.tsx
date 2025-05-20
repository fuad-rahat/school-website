"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleNavigation = (path: string) => {
    setIsMenuOpen(false)
    router.push(path)
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3" prefetch>
            <Image
              src="/shuktara.jpg"
              alt="School Logo"
              width={50}
              height={50}
              className="h-12 rounded-full w-auto"
              priority
            />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-900">শুকতারা বিদ্যানিকেতন</h1>
              <p className="text-xs text-gray-600">EIIN-130825</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900" prefetch>
              হোম
            </Link>
            <Link href="/teachers" className="text-gray-600 hover:text-gray-900" prefetch>
              শিক্ষকমণ্ডলী
            </Link>
            <Link href="/notice" className="text-gray-600 hover:text-gray-900" prefetch>
              নোটিশ
            </Link>
            <Link href="/results" className="text-gray-600 hover:text-gray-900" prefetch>
              ফলাফল
            </Link>
            <Link href="/alumni" className="text-gray-600 hover:text-gray-900 flex items-center gap-1" prefetch>
              প্রাক্তন শিক্ষার্থী
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900" prefetch>
              আমাদের সম্পর্কে
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900" prefetch>
              যোগাযোগ
            </Link>
            <Button asChild variant="default">
              <Link href="/admin/login" prefetch>Admin Login</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-4">
            <button
              onClick={() => handleNavigation("/")}
              className="block w-full text-left text-gray-600 hover:text-gray-900"
            >
              হোম
            </button>
            <button
              onClick={() => handleNavigation("/teachers")}
              className="block w-full text-left text-gray-600 hover:text-gray-900"
            >
              শিক্ষকমণ্ডলী
            </button>
            <button
              onClick={() => handleNavigation("/notice")}
              className="block w-full text-left text-gray-600 hover:text-gray-900"
            >
              নোটিশ
            </button>
            <button
              onClick={() => handleNavigation("/results")}
              className="block w-full text-left text-gray-600 hover:text-gray-900"
            >
              ফলাফল
            </button>
            <button
              onClick={() => handleNavigation("/alumni")}
              className="block w-full text-left text-gray-600 hover:text-gray-900"
            >
              প্রাক্তন শিক্ষার্থী
            </button>
            <button
              onClick={() => handleNavigation("/about")}
              className="block w-full text-left text-gray-600 hover:text-gray-900"
            >
              আমাদের সম্পর্কে
            </button>
            <button
              onClick={() => handleNavigation("/contact")}
              className="block w-full text-left text-gray-600 hover:text-gray-900"
            >
              যোগাযোগ
            </button>
            <Button asChild variant="default" className="w-full">
              <Link href="/admin/login" prefetch>Admin Login</Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}
