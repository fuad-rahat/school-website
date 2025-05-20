import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/auth"

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

    // Debug log
    console.log("API: Fetching notices with query:", query)

    const notices = await db.collection("notices").find(query).sort({ date: -1 }).limit(limit).toArray()

    // Debug log
    console.log(`API: Found ${notices.length} notices`)

    return NextResponse.json(notices)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch notices" }, { status: 500 })
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

    const notice = await request.json()

    // Add timestamps
    notice.createdAt = new Date()
    notice.updatedAt = new Date()

    // Debug log
    console.log("API: Creating new notice:", notice.title)

    const result = await db.collection("notices").insertOne(notice)

    // Debug log
    console.log("API: Created new notice with ID:", result.insertedId)

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      notice: { ...notice, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to create notice" }, { status: 500 })
  }
}
