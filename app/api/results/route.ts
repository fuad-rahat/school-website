import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()

    const results = await db.collection("results").find().sort({ year: -1 }).toArray()

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error fetching results:", error)
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const client = await clientPromise
    const db = client.db()

    // Add timestamps
    data.createdAt = new Date()
    data.updatedAt = new Date()

    const result = await db.collection("results").insertOne(data)

    return NextResponse.json({ ...data, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating result:", error)
    return NextResponse.json({ error: "Failed to create result" }, { status: 500 })
  }
}
