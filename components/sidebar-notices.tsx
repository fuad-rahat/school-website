"use client"

import { useEffect, useState } from "react"
import { formatDate } from "@/lib/utils"

interface Notice {
  _id: string
  title: string
  date: string
  category: string
  content: string
}

export default function SidebarNotices() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch('/api/notices/recent')
        if (response.ok) {
          const data = await response.json()
          setNotices(data)
        }
      } catch (error) {
        console.error('Error fetching notices:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
  }, [])

  if (loading) {
    return (
      <div className="space-y-3 text-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (notices.length === 0) {
    return (
      <div className="space-y-3 text-sm">
        <p className="text-muted-foreground">No recent notices</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 text-sm">
      {notices.map((notice) => (
        <div key={notice._id}>
          <p className="font-medium">{notice.title}</p>
          <p className="text-muted-foreground">{formatDate(notice.date)}</p>
        </div>
      ))}
    </div>
  )
} 