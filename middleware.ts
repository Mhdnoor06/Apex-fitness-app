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
  const isOnApiAuth = nextUrl.pathname.startsWith("/api/auth")
  const isOnApiOnboarding = nextUrl.pathname.startsWith("/api/onboarding")
  const isOnApiProfile = nextUrl.pathname.startsWith("/api/profile")

  // Allow access to login, signup, forgot password, onboarding, and API routes
  if (isOnLogin || isOnSignup || isOnForgotPassword || isOnOnboarding || isOnApiAuth || isOnApiOnboarding || isOnApiProfile) {
    if (isLoggedIn && (isOnLogin || isOnSignup || isOnForgotPassword)) {
      // Redirect to home if already logged in
      return Response.redirect(new URL("/", nextUrl))
    }
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

