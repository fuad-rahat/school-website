import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import type { Teacher } from "@/lib/models"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("school")

    const teachers = await db.collection("teachers").find({}).sort({ name: 1 }).toArray()

    return NextResponse.json(teachers)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 })
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

    const teacher: Teacher = await request.json()

    // Add timestamps
    teacher.createdAt = new Date()
    teacher.updatedAt = new Date()

    const result = await db.collection("teachers").insertOne(teacher)

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      teacher: { ...teacher, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 })
  }
}
