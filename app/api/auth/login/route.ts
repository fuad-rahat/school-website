import { NextResponse } from "next/server"
import { SignJWT } from "jose"
import clientPromise from "@/lib/mongodb"

const secretKey = process.env.JWT_SECRET || "thisIsVerySecretKey"
const key = new TextEncoder().encode(secretKey)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    if (!username || !password) {
      return NextResponse.json({ success: false, error: "Missing credentials" })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("school")
    const admin = await db.collection("admins").findOne({ username })

    if (!admin || admin.password !== password) {
      return NextResponse.json({ success: false, error: "Invalid credentials" })
    }

    const jwt = await new SignJWT({
      userId: admin._id.toString(),
      username: admin.username,
      role: "admin",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(key)

    const response = NextResponse.json({ success: true })
    response.cookies.set("auth-token", jwt, {
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 24 hours
    })

    // Also set a session cookie for middleware to use
    response.cookies.set(
      "session",
      jwt,
      {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 24 hours
      },
    )

    return response
  } catch (error) {
    console.error("Login failed:", error)
    return NextResponse.json({ success: false, error: "Login failed" })
  }
}
