import Link from "next/link"
import { CalendarDays, Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SidebarNotices from "./sidebar-notices"

export default function Sidebar() {
  return (
    <aside className="w-full md:w-80 lg:w-96 md:sticky md:top-0 md:self-start md:h-screen md:overflow-y-auto p-4 space-y-6">
      {/* School Calendar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <CalendarDays className="mr-2 h-5 w-5" />
            স্কুল ক্যালেন্ডার
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            
            <div className="flex justify-between">
              <span>২১ ফেব্রুয়ারি</span>
              <span>আন্তর্জাতিক মাতৃভাষা দিবস</span>
            </div>
            <div className="flex justify-between">
              <span>২৬ মার্চ</span>
              <span>স্বাধীনতা দিবস</span>
            </div>
            <div className="flex justify-between">
              <span>১৪ এপ্রিল</span>
              <span>বাংলা নববর্ষ</span>
            </div>
            <div className="flex justify-between">
              <span>১ মে</span>
              <span>মে দিবস</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* School Pledge */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">শপথ বাক্য</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm italic">
            "আমি শপথ করেতেছি যে, আমরা সর্বদা সত্য বলব, সৎ থাকব, দেশ ও জাতির কল্যাণে নিয়জিত থাকব, সকলের প্রতি
            শ্রদ্ধাশীল থাকব এবং জ্ঞান অর্জনের মাধ্যমে নিজেদেরকে যোগ্য নাগরিক হিসেবে গড়ে তুলব।"
          </p>
        </CardContent>
      </Card>

      {/* Latest Notices */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <Bell className="mr-2 h-5 w-5" />
            সাম্প্রতিক নোটিশ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            
            <SidebarNotices />
          </div>
          <div className="mt-4">
            <Link href="/notice" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
              সকল নোটিশ দেখুন →
            </Link>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
