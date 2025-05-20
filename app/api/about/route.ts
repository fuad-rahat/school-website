import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("school")

    // Debug log
    console.log("API: Fetching about data")

    const aboutData = await db.collection("about").find().toArray()

    // Debug log
    console.log(`API: Found ${aboutData.length} about entries`)

    return NextResponse.json(aboutData)
  } catch (error) {
    console.error("Error fetching about data:", error)
    return NextResponse.json({ error: "Failed to fetch about data" }, { status: 500 })
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
    const db = client.db("school")

    // Add timestamps
    data.createdAt = new Date()
    data.updatedAt = new Date()

    // Check if there's already an about entry
    const existingAbout = await db.collection("about").findOne({})

    if (existingAbout) {
      // Update the existing entry instead of creating a new one
      const updatedAbout = await db
        .collection("about")
        .findOneAndUpdate(
          { _id: existingAbout._id },
          { $set: { ...data, updatedAt: new Date() } },
          { returnDocument: "after" },
        )

      // Debug log
      console.log("API: Updated existing about entry")

      return NextResponse.json(updatedAbout.value)
    }

    // Create a new entry if none exists
    const result = await db.collection("about").insertOne(data)

    // Debug log
    console.log("API: Created new about entry")

    return NextResponse.json({ ...data, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating about data:", error)
    return NextResponse.json({ error: "Failed to create about data" }, { status: 500 })
  }
}
