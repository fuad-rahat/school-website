import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import type { Alumni } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("school")

    // Get query parameters
    const url = new URL(request.url)
    const featured = url.searchParams.get("featured")
    const year = url.searchParams.get("year")
    const limit = Number.parseInt(url.searchParams.get("limit") || "100")

    // Build query
    const query: any = {}
    if (featured === "true") {
      query.featured = true
    }
    if (year) {
      // Convert to number for proper querying
      query.graduationYear = Number.parseInt(year)
    }

    // Create index for better performance if it doesn't exist
    await db.collection("alumni").createIndex({ graduationYear: -1 })
    if (featured === "true") {
      await db.collection("alumni").createIndex({ featured: 1 })
    }

    const alumni = await db.collection("alumni").find(query).sort({ graduationYear: -1 }).limit(limit).toArray()

    return NextResponse.json(alumni)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch alumni" }, { status: 500 })
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

    const alumni: Alumni = await request.json()

    // Add timestamps
    alumni.createdAt = new Date()
    alumni.updatedAt = new Date()

    const result = await db.collection("alumni").insertOne(alumni)

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      alumni: { ...alumni, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to create alumni" }, { status: 500 })
  }
}
