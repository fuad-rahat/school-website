import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("school")

    const about = await db.collection("about").findOne({
      _id: new ObjectId(params.id),
    })

    if (!about) {
      return NextResponse.json({ error: "About information not found" }, { status: 404 })
    }

    return NextResponse.json(about)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch about information" }, { status: 500 })
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

    const result = await db.collection("about").updateOne({ _id: new ObjectId(params.id) }, { $set: updates })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "About information not found" }, { status: 404 })
    }

    // Fetch the updated document to return
    const updatedAbout = await db.collection("about").findOne({
      _id: new ObjectId(params.id),
    })

    return NextResponse.json({
      success: true,
      message: "About information updated successfully",
      about: updatedAbout,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        error: "Failed to update about information",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
