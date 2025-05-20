import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("school")

    const activity = await db.collection("activities").findOne({
      _id: new ObjectId(params.id),
    })

    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 })
    }

    return NextResponse.json(activity)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 })
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

    const result = await db.collection("activities").updateOne({ _id: new ObjectId(params.id) }, { $set: updates })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 })
    }

    // Fetch the updated document to return
    const updatedActivity = await db.collection("activities").findOne({
      _id: new ObjectId(params.id),
    })

    return NextResponse.json({
      success: true,
      message: "Activity updated successfully",
      activity: updatedActivity,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        error: "Failed to update activity",
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

    // First check if the activity exists
    const activity = await db.collection("activities").findOne({
      _id: new ObjectId(params.id),
    })

    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 })
    }

    const result = await db.collection("activities").deleteOne({
      _id: new ObjectId(params.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Activity deleted successfully",
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        error: "Failed to delete activity",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
