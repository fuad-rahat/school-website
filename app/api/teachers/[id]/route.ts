import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("school")

    const teacher = await db.collection("teachers").findOne({
      _id: new ObjectId(params.id),
    })

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    return NextResponse.json(teacher)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch teacher" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("school")

    const updates = await request.json()

    // Add updated timestamp
    updates.updatedAt = new Date()

    // Ensure _id is not included in the update
    delete updates._id

    const result = await db.collection("teachers").updateOne({ _id: new ObjectId(params.id) }, { $set: updates })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    // Fetch the updated document to return
    const updatedTeacher = await db.collection("teachers").findOne({
      _id: new ObjectId(params.id),
    })

    return NextResponse.json({
      success: true,
      message: "Teacher updated successfully",
      teacher: updatedTeacher,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        error: "Failed to update teacher",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("school")

    // First check if the teacher exists
    const teacher = await db.collection("teachers").findOne({
      _id: new ObjectId(params.id),
    })

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    const result = await db.collection("teachers").deleteOne({
      _id: new ObjectId(params.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Failed to delete teacher" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Teacher deleted successfully",
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        error: "Failed to delete teacher",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
