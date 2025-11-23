"use client"

import { usePathname } from "next/navigation"
import { BottomNavigation } from "./bottom-navigation"

export function LayoutNavigation() {
  const pathname = usePathname()

  // Hide navigation on auth and onboarding pages
  const hideNavigation = 
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/api")

  if (hideNavigation) {
    return null
  }

  return <BottomNavigation />
}

