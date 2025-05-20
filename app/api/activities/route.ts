import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import type { Activity } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("school")

    // Get query parameters
    const url = new URL(request.url)
    const category = url.searchParams.get("category")
    const limit = Number.parseInt(url.searchParams.get("limit") || "100")

    // Build query
    const query: any = {}
    if (category) {
      query.category = category
    }

    const activities = await db.collection("activities").find(query).sort({ title: 1 }).limit(limit).toArray()

    return NextResponse.json(activities)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("school")

    const activity: Activity = await request.json()

    // Add timestamps
    activity.createdAt = new Date()
    activity.updatedAt = new Date()

    const result = await db.collection("activities").insertOne(activity)

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      activity: { ...activity, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 })
  }
}
