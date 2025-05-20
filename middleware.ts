import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secretKey = process.env.JWT_SECRET || "thisIsVerySecretKey"
const key = new TextEncoder().encode(secretKey)

async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    return false
  }

  try {
    await jwtVerify(token, key)
    return true
  } catch (error) {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isLoginPage = request.nextUrl.pathname === "/admin/login"
  const isAuthenticated = await verifyAuth(request)

  // Allow access to login page if not authenticated
  if (isLoginPage && !isAuthenticated) {
    return NextResponse.next()
  }

  // Redirect to login if trying to access admin route without auth
  if (isAdminRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  // Redirect to dashboard if authenticated and trying to access login page
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
