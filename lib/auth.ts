import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { decrypt } from "@/lib/session"

const secretKey = process.env.JWT_SECRET || "thisIsVerySecretKey"
const key = new TextEncoder().encode(secretKey)

export async function login(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username || !password) {
    return { success: false, error: "Missing credentials" }
  }

  if (username !== "admin" || password !== "admin") {
    return { success: false, error: "Invalid credentials" }
  }

  try {
    const jwt = await new SignJWT({
      userId: "admin",
      username: "admin",
      role: "admin",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(key)

    cookies().set("auth-token", jwt, {
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 24 hours
    })

    // Also set a session cookie for middleware to use
    cookies().set(
      "session",
      await encrypt({
        userId: "admin",
        username: "admin",
        role: "admin",
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      }),
      {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 24 hours
      },
    )

    return { success: true }
  } catch (error) {
    console.error("Login failed:", error)
    return { success: false, error: "Login failed" }
  }
}

export async function logout() {
  cookies().delete("auth-token")
  cookies().delete("session")
}

export async function encrypt(payload: any) {
  const jwt = await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("24h").sign(key)
  return jwt
}

export async function decrypt(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, key)
    return payload
  } catch (error) {
    console.error("Failed to decrypt token:", error)
    return null
  }
}

// Add the missing getSession function
export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value
  if (!session) return null
  return await decrypt(session)
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value
  if (!session) return

  try {
    const parsed = await decrypt(session)
    if (!parsed) return

    const res = NextResponse.next()
    res.cookies.set({
      name: "session",
      value: await encrypt(parsed),
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    })

    return res
  } catch (error) {
    console.error("Failed to update session:", error)
    return
  }
}
