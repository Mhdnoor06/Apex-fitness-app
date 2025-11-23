/**
 * Type definitions for API requests and responses
 */

// User types
export interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  gender: string | null
  age: number | null
  height: number | null
  weight: number | null
  goal: string | null
  activityLevel: string | null
  bmi: number | null
  tdee: number | null
  targetCalories: number | null
  targetProtein: number | null
  onboardingCompleted: boolean
}

// Auth types
export interface SignupRequest {
  name: string
  email: string
  password: string
}

export interface SignupResponse {
  message: string
  userId: string
}

export interface LoginRequest {
  email: string
  password: string
}

// Onboarding types
export interface OnboardingRequest {
  email: string
  gender: string
  age: string | number
  height: string | number
  weight: string | number
  goal: string
  activityLevel: string
  bmi: string | number
  tdee: number
  targetCalories: number
  targetProtein: number
}

export interface OnboardingResponse {
  message: string
  user: User
}

// Profile types
export interface ProfileResponse {
  user: User
}

export interface UpdateProfileRequest {
  name?: string
  gender?: string
  age?: string | number
  height?: string | number
  weight?: string | number
  goal?: string
  activityLevel?: string
}

export interface UpdateProfileResponse {
  message: string
  user: User
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ChangePasswordResponse {
  message: string
}

