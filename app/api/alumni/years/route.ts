import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("school")

    // Use distinct to get only unique graduation years
    const years = await db.collection("alumni").distinct("graduationYear")

    // Convert to strings for consistency
    const yearStrings = years.map((year) => year.toString())

    return NextResponse.json(yearStrings)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch alumni years" }, { status: 500 })
  }
}
