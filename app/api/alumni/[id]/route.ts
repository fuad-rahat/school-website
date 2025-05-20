import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("school")

    const alumni = await db.collection("alumni").findOne({
      _id: new ObjectId(params.id),
    })

    if (!alumni) {
      return NextResponse.json({ error: "Alumni not found" }, { status: 404 })
    }

    return NextResponse.json(alumni)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch alumni" }, { status: 500 })
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

    const result = await db.collection("alumni").updateOne({ _id: new ObjectId(params.id) }, { $set: updates })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Alumni not found" }, { status: 404 })
    }

    // Fetch the updated document to return
    const updatedAlumni = await db.collection("alumni").findOne({
      _id: new ObjectId(params.id),
    })

    return NextResponse.json({
      success: true,
      message: "Alumni updated successfully",
      alumni: updatedAlumni,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        error: "Failed to update alumni",
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

    // First check if the alumni exists
    const alumni = await db.collection("alumni").findOne({
      _id: new ObjectId(params.id),
    })

    if (!alumni) {
      return NextResponse.json({ error: "Alumni not found" }, { status: 404 })
    }

    const result = await db.collection("alumni").deleteOne({
      _id: new ObjectId(params.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Failed to delete alumni" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Alumni deleted successfully",
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        error: "Failed to delete alumni",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
