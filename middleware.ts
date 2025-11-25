import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isOnLogin = nextUrl.pathname.startsWith("/login")
  const isOnSignup = nextUrl.pathname.startsWith("/signup")
  const isOnForgotPassword = nextUrl.pathname.startsWith("/forgot-password")
  const isOnOnboarding = nextUrl.pathname.startsWith("/onboarding")
  const isOnApi = nextUrl.pathname.startsWith("/api")

  // Allow access to all API routes
  if (isOnApi) {
    return
  }

  // Handle auth page redirects
  if (isOnLogin || isOnSignup || isOnForgotPassword) {
    if (isLoggedIn) {
      // Redirect to home if already logged in
      return Response.redirect(new URL("/", nextUrl))
    }
    return
  }

  // Allow onboarding page
  if (isOnOnboarding) {
    return
  }

  // Protect all other routes
  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl))
  }
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}

