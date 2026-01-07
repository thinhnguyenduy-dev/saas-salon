import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req
  const user = req.auth?.user as any
  const role = user?.role

  // Protected Routes
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard")
  const isBookingsRoute = nextUrl.pathname.startsWith("/bookings")
  
  if (isDashboardRoute) {
      if (!isLoggedIn) {
          return NextResponse.redirect(new URL("/login", nextUrl))
      }
      // Optional: Prevent Customer from accessing dashboard
      if (role === "CUSTOMER") {
          return NextResponse.redirect(new URL("/search", nextUrl)) // or 403
      }
  }

  if (isBookingsRoute) {
      if (!isLoggedIn) {
          return NextResponse.redirect(new URL("/login", nextUrl))
      }
  }
  
  return NextResponse.next()
})

export const config = {
  // Matcher ignoring static files
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
