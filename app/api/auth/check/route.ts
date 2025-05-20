import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

const secretKey = process.env.JWT_SECRET || "thisIsVerySecretKey"
const key = new TextEncoder().encode(secretKey)

export async function GET(request: Request) {
  try {
    const token = request.headers.get("cookie")?.split("auth-token=")[1]?.split(";")[0]

    if (!token) {
      return new NextResponse(null, { status: 401 })
    }

    await jwtVerify(token, key)
    return new NextResponse(null, { status: 200 })
  } catch (error) {
    return new NextResponse(null, { status: 401 })
  }
} 