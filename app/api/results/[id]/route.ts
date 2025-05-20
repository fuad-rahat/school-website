import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("school")

    const result = await db.collection("results").findOne({
      _id: new ObjectId(params.id),
    })

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch result" }, { status: 500 })
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

    const result = await db.collection("results").updateOne({ _id: new ObjectId(params.id) }, { $set: updates })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }

    // Fetch the updated document to return
    const updatedResult = await db.collection("results").findOne({
      _id: new ObjectId(params.id),
    })

    return NextResponse.json({
      success: true,
      message: "Result updated successfully",
      result: updatedResult,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        error: "Failed to update result",
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

    // First check if the result exists
    const resultDoc = await db.collection("results").findOne({
      _id: new ObjectId(params.id),
    })

    if (!resultDoc) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }

    const deleteResult = await db.collection("results").deleteOne({
      _id: new ObjectId(params.id),
    })

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: "Failed to delete result" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Result deleted successfully",
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        error: "Failed to delete result",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
