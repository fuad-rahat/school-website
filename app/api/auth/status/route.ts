import { getSession } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getSession()

  if (session) {
    return NextResponse.json({
      authenticated: true,
      user: {
        username: session.username,
        role: session.role,
      },
    })
  } else {
    return NextResponse.json({
      authenticated: false,
    })
  }
}
