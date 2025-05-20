import type { Metadata } from "next"
import Image from "next/image"
import { CalendarDays } from "lucide-react"

import { connectToDatabase } from "@/lib/mongodb"
import { Activity } from "@/lib/models"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Activities - School Website",
  description: "School activities and events",
}

async function getActivities() {
  try {
    await connectToDatabase()
    const activities = await Activity.find().sort({ date: -1 }).lean()
    return JSON.parse(JSON.stringify(activities))
  } catch (error) {
    console.error("Error fetching activities:", error)
    return []
  }
}

export default async function ActivitiesPage() {
  const activities = await getActivities()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">School Activities</h1>

      {activities.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No activities found</h3>
          <p className="text-muted-foreground">Check back later for upcoming events and activities.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="overflow-hidden rounded-lg border bg-card shadow transition-all hover:shadow-md"
            >
              <div className="aspect-video overflow-hidden">
                <Image
                  src={activity.image || "/placeholder.svg?height=300&width=500"}
                  alt={activity.title}
                  width={500}
                  height={300}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <time dateTime={activity.date}>{formatDate(activity.date)}</time>
                </div>
                <h3 className="mt-2 text-xl font-semibold">{activity.title}</h3>
                <p className="mt-2 line-clamp-3">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
