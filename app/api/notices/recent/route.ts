import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("school")

    // Fetch the 3 most recent notices
    const notices = await db
      .collection("notices")
      .find({})
      .sort({ date: -1 })
      .limit(3)
      .toArray()

    return NextResponse.json(notices)
  } catch (error) {
    console.error("Error fetching recent notices:", error)
    return NextResponse.json({ error: "Failed to fetch notices" }, { status: 500 })
  }
} 