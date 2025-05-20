import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Alumni } from "@/lib/models"

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("school")

    const alumni: Partial<Alumni> = await request.json()

    // Add timestamps
    alumni.createdAt = new Date()
    alumni.updatedAt = new Date()

    // Validate required fields
    if (!alumni.name || !alumni.graduationYear) {
      return NextResponse.json({ error: "Name and graduation year are required" }, { status: 400 })
    }

    const result = await db.collection("alumni").insertOne(alumni as Alumni)

    return NextResponse.json({
      success: true,
      id: result.insertedId,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to register alumni" }, { status: 500 })
  }
}
