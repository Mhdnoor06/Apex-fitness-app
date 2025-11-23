/**
 * Profile API service
 * Handles all profile-related API calls
 */

import { api } from "./client"
import type {
  ProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "./types"

const PROFILE_ENDPOINTS = {
  get: "/api/profile",
  update: "/api/profile",
  changePassword: "/api/profile/change-password",
} as const

export const profileService = {
  /**
   * Get current user's profile
   */
  getProfile: async (): Promise<ProfileResponse> => {
    return api.get<ProfileResponse>(PROFILE_ENDPOINTS.get)
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    return api.put<UpdateProfileResponse>(PROFILE_ENDPOINTS.update, data)
  },

  /**
   * Change user password
   */
  changePassword: async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    return api.post<ChangePasswordResponse>(PROFILE_ENDPOINTS.changePassword, data)
  },
}

