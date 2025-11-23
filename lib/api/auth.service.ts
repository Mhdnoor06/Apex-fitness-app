/**
 * Authentication API service
 * Handles all authentication-related API calls
 */

import { api } from "./client"
import type { SignupRequest, SignupResponse } from "./types"

const AUTH_ENDPOINTS = {
  signup: "/api/auth/signup",
  login: "/api/auth/signin",
  logout: "/api/auth/signout",
} as const

export const authService = {
  /**
   * Sign up a new user
   */
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    return api.post<SignupResponse>(AUTH_ENDPOINTS.signup, data)
  },

  /**
   * Login user (handled by NextAuth, but kept for consistency)
   */
  login: async (email: string, password: string) => {
    // NextAuth handles login through signIn function
    // This is kept for future use if needed
    throw new Error("Use NextAuth signIn function for login")
  },
}

