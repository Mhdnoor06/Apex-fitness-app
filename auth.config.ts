import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnLogin = nextUrl.pathname.startsWith("/login")
      const isOnSignup = nextUrl.pathname.startsWith("/signup")
      const isOnForgotPassword = nextUrl.pathname.startsWith("/forgot-password")

      // Allow access to login, signup, and forgot password pages
      if (isOnLogin || isOnSignup || isOnForgotPassword) {
        // Redirect to home if already logged in (handled in middleware)
        return !isLoggedIn
      }

      // Protect all other routes
      return isLoggedIn
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig

